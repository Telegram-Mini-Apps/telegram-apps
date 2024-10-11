import { resolve, basename, relative, join, sep, extname } from 'node:path';
import process from 'node:process';
import { lstatSync } from 'node:fs';

import { pipe } from 'ramda';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';

import { DEFAULT_ENDPOINT, DEFAULT_TAG } from '@/const.js';
import { hl } from '@/chalk/hl.js';
import { API } from '@/lib/API.js';
import { renderTree } from '@/fs-tree/renderTree.js';

import { optionsToArgs } from '@/piping/optionsToArgs.js';
import { injectLoggers } from '@/piping/injectLoggers.js';
import { logArgs } from '@/piping/logArgs.js';
import { injectConfig } from '@/piping/injectConfig.js';
import { injectDeployBaseProps } from '@/piping/injectDeployBaseProps.js';
import { compress } from '@/compress/compress.js';
import { walkDir } from '@/fs-tree/walkDir.js';
import { getDeploymentInfo } from '@/operations/getDeploymentInfo.js';
import { formatSize } from '@/formatSize.js';
import type { TreeDir, TreeItem } from '@/fs-tree/types.js';

/**
 * @returns true if the path is considered as hidden.
 * @param path - path to check.
 */
function isHiddenPath(path: string): boolean {
  return basename(path).startsWith('.');
}

/**
 * Converts a path to posix-correct.
 * @example abc\ddd -> abc/ddd
 * @param path - path to convert.
 */
function canonicalizePath(path: string) {
  return sep === '\\' ? path.replace(/\\/g, '/') : path;
}

export const upload = new Command()
  .name('upload')
  .description('Deploys specified directory to the Telegram Mini Apps CDN')
  .option('--verbose', 'enables debug mode')
  .option('-e, --endpoint <endpoint>', 'API endpoint')
  .option('-c, --config <config path>', 'mate configuration location')
  .option('--tag <tag name>', 'specific version name')
  .option('--token <deploy token>', 'token used to deploy the project')
  .option('-p, --project <project name>', 'project identifier. Example: 191', Number)
  .option('-d, --dir <directory>', 'directory to deploy to CDN')
  .action(
    pipe(
      optionsToArgs<{
        config?: string;
        dir?: string;
        endpoint?: string;
        project?: number;
        tag?: string;
        token?: string;
        verbose?: boolean;
      }>,
      injectLoggers,
      logArgs,
      injectConfig,
      injectDeployBaseProps({ endpoint: DEFAULT_ENDPOINT, tag: DEFAULT_TAG }),
      async ({
        dir: optionsDir,
        project,
        endpoint,
        config,
        logger,
        verboseLogger,
        tag,
        token,
      }) => {
        const dir = optionsDir || config?.deploy?.directory;
        if (!dir) {
          logger.error(
            'Unable to determine directory to deploy. Consider using the related command option or specifying a value in the mate config file',
          );
          process.exit(1);
        }
        verboseLogger.debug('Using directory:', dir);

        // Validate the passed path.
        const resolvedDir = resolve(dir);
        verboseLogger.debug('Resolved directory:', resolvedDir);

        if (isHiddenPath(resolvedDir)) {
          logger.error(
            `Path "${resolvedDir}" refers to a hidden directory. Consider removing the "." prefix in the directory name`,
          );
          process.exit(1);
        }

        if (!lstatSync(resolvedDir).isDirectory()) {
          logger.error(`Path "${resolvedDir}" must refer to a directory`);
          process.exit(1);
        }

        //#region Getting deployment limits.

        const {
          allowedExtensions,
          maxSize,
          maxFilesCount,
          basePath,
        } = await getDeploymentInfo({
          endpoint,
          token,
          tag,
          project,
        }).catch(() => process.exit(1));

        logger.info(`Assets base path (using tag "${tag}"): ${hl(basePath)}`);
        logger.info(`Allowed file extensions: ${allowedExtensions.map(ext => hl(ext)).join(', ')}`);
        logger.info(`Maximum upload size: ${hl(formatSize(maxSize))}`);
        logger.info(`Maximum files count: ${hl(maxFilesCount)}`);

        //#endregion

        //#region Validation.

        // Tree, describing the uploaded directory.
        const tree: TreeDir = {
          type: 'dir',
          name: basename(resolvedDir),
          items: {},
          relative: '',
        };

        /**
         * Adds the specified path to tree.
         * @param path - path to add.
         * @param type - entity type.
         */
        function addToTree(path: string, type: 'dir' | 'file') {
          let currentRelative = '.';
          let currentNode = tree;
          let currentPath = canonicalizePath(relative(resolvedDir, path));

          let match: RegExpMatchArray;
          // eslint-disable-next-line no-cond-assign
          while (match = currentPath.match(/^(.+?[^\\])\/(.+)$/)!) {
            const [, dir, other] = match;
            currentRelative = join(currentRelative, dir);
            currentNode.items[dir] ||= {
              type: 'dir',
              items: {},
              name: dir,
              relative: canonicalizePath(currentRelative),
            };
            currentNode = currentNode.items[dir] as TreeDir;
            currentPath = other;
          }
          currentNode.items[currentPath] ||= {
            name: currentPath,
            relative: canonicalizePath(join(currentRelative, currentPath)),
            ...(type === 'dir'
              ? { type: 'dir', items: {} }
              : { type: 'file' }),
          };
        }

        const forbiddenExt: string[] = [];
        const unexpected: string[] = [];
        const hidden: [path: string, type: 'dir' | 'file'][] = [];
        let size = 0;
        let filesCount = 0;

        /**
         * Returns a relative path to the element with the root directory name prepended.
         * @param path - entity path.
         */
        function rel(path: string) {
          return relative(resolve(resolvedDir, '..'), path);
        }

        walkDir(resolvedDir, (path, stats) => {
          // We work only with directories and files. All other types must be excluded.
          if (!stats.isDirectory() && !stats.isFile()) {
            unexpected.push(rel(path));
            return false;
          }

          if (path === resolvedDir) {
            return true;
          }

          // Exclude hidden files and directories.
          const type = stats.isDirectory() ? 'dir' : 'file';
          if (basename(path).startsWith('.')) {
            hidden.push([rel(path), type]);
            return false;
          }

          if (stats.isFile()) {
            // Check if a file extension is allowed.
            if (!allowedExtensions.includes(extname(path).slice(1).toLowerCase())) {
              forbiddenExt.push(rel(path));
              return false;
            }
            size += stats.size;
            filesCount++;
          }
          addToTree(path, type);
          return true;
        });

        if (
          hidden.length
          || unexpected.length
          || forbiddenExt.length
          || size === 0
          || size > maxSize
          || filesCount > maxFilesCount
        ) {
          if (hidden.length) {
            logger.error([
              'Hidden (starting from the "." symbol) files and directories are ignored during deploy. Found paths:',
              ...hidden.map(([path, type]) => {
                return `${type === 'dir' ? '📁' : '📄'} ${chalk.yellow(path)}`;
              }),
            ].join('\n'));
          }

          if (unexpected.length) {
            logger.error([
              'Files with unexpected types were met:',
              ...unexpected.map(p => `- ${chalk.yellow(p)}`),
            ].join('\n'));
          }

          if (forbiddenExt.length) {
            logger.error([
              'Files with forbidden extensions were met:',
              ...forbiddenExt.map(p => `- ${chalk.yellow(p)}`),
            ].join('\n'));
          }

          if (size === 0) {
            logger.error(`appeared to be having no files to be uploaded`);
          }

          if (size > maxSize) {
            logger.error(
              `Archive size exceeds the maximum allowed. Archive size is ${hl(size)} bytes, when only ${hl(maxSize)} bytes is allowed`,
            );
          }

          if (filesCount > maxFilesCount) {
            logger.error(
              `Archive files count exceeds the maximum allowed. Archive files count is ${hl(filesCount)}, when only ${hl(maxFilesCount)} files is allowed`,
            );
          }
          process.exit(1);
        }

        //#endregion

        //#region Compressing the directory.

        // At this moment, we already know, that compressed directory contains only valid files.
        const compressSpinner = ora({
          text: `Compressing directory: ${hl(resolvedDir)}`,
        }).start();
        const buffer = await compress(resolvedDir);
        compressSpinner.succeed(
          `Directory compressed successfully from ${hl(size)} to ${hl(buffer.length)} bytes`,
        );

        //#endregion

        //#region Deploying the archive.

        const deploySpinner = ora({ text: 'Uploading the archive' }).start();
        try {
          const response = await new API(endpoint, token).deployProject(project, tag, buffer);
          const linksMap = new Map<string, string>(
            response.assets.map(({ url, path }) => [path, url]),
          );
          deploySpinner.succeed('Archive uploaded successfully');

          // Example of the rendered tree:
          // 📁 src
          // ├ 📁 commands
          // │ ╰ 📁 deploy
          // │   ├ 📄 deploy.ts
          // │   ├ 📄 info.ts
          // │   ╰ 📄 upload.ts
          // ├ 📄 config.ts
          // ├ 📄 const.ts
          // ├ 📁 errors
          // │ ├ 📄 CLIError.ts
          // │ ├ 📄 errors.ts
          // │ ╰ 📄 exit-codes.ts
          // ├ 📄 index.ts
          // ├ 📁 lib
          // │ ╰ 📄 API.ts
          // ╰ 📄 logging.ts
          console.log(
            renderTree({
              dir: tree,
              suffix(item: TreeItem): string {
                const url = linksMap.get(item.relative);
                return url ? ` (${url})` : '';
              },
            }),
          );
        } catch (e) {
          deploySpinner.fail(
            chalk.red(`Upload failed: ${e instanceof Error ? e.message : JSON.stringify(e)}`),
          );
        }

        //#endregion
      },
    ),
  );