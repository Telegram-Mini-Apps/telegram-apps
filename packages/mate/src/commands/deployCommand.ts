import { resolve, join, posix, extname } from 'node:path';
import { existsSync, lstatSync, readdirSync, createReadStream } from 'node:fs';

import { Command } from 'commander';
import chalk from 'chalk';
import { spawnWithSpinner } from 'cli-utils';
import { S3 } from '@aws-sdk/client-s3';
import mimeDb from 'mime-db';

import { GCoreAPI } from '../lib/GCoreAPI.js';
import { Logger } from '../logging/Logger.js';
import { logError } from '../logging/logError.js';
import { logInfo } from '../logging/logInfo.js';
import { logSuccess } from '../logging/logSuccess.js';

/**
 * Recursively walks directories collecting all paths to files.
 * @param dir - directory to start walking from.
 * @param prevDir - previously collected directories.
 */
function walkDirectory(dir: string, prevDir: string[] = []): string[][] {
  return readdirSync(dir).reduce<string[][]>((acc, item) => {
    const path = resolve(dir, item);
    const stat = lstatSync(path);

    if (stat.isDirectory()) {
      acc.push(...walkDirectory(path, [...prevDir, item]));
    } else if (stat.isFile()) {
      acc.push([...prevDir, item]);
    }

    return acc;
  }, []);
}

export const deployCommand = new Command()
  .name('deploy')
  .description('Deploys specified directory to the Telegram Mini Apps CDN')
  .addCommand(
    new Command('gcore')
      .option('--debug', 'enable debug mode')
      .option('--verbose', 'enable debug mode')
      .requiredOption('--s3-access-key <key>', 'S3 access key id')
      .requiredOption('--s3-secret-key <key>', 'S3 secret access key')
      .requiredOption('--s3-endpoint <endpoint>', 'S3 endpoint')
      .requiredOption('--s3-region <region>', 'S3 region identifier')
      .requiredOption('--s3-bucket <bucket name>', 'S3 bucket name')
      .requiredOption('--api-key <key>', 'gcore API Key')
      .requiredOption('-p, --project <project name>', 'project identifier. Example: "my-mini-app"')
      .requiredOption('-d, --dir <directory>', 'directory to deploy to CDN')
      .action(async (options: {
        apiKey: string;
        dir: string;
        project: string;
        s3AccessKey: string;
        s3Bucket: string;
        s3Endpoint: string;
        s3Region: string;
        s3SecretKey: string;
        verbose: boolean;
      }) => {
        const logger = options.verbose ? new Logger() : undefined;
        logger?.log('Using options:', options);

        // Check if the path exists.
        const rootDir = resolve(process.cwd(), options.dir);
        if (!existsSync(rootDir)) {
          logError(`Path ${chalk.yellow(rootDir)} doesn't exist`);
          process.exit(1);
        }

        // Check if the path refers to a directory.
        if (!lstatSync(rootDir).isDirectory()) {
          logError(`Path ${chalk.yellow(rootDir)} must refer to a directory`);
          process.exit(2);
        }

        // Check if the path refers to a non-empty directory.
        const files = walkDirectory(rootDir);
        if (!files.length) {
          logError(`Directory ${chalk.yellow(rootDir)} doesn't contain any files`);
          process.exit(3);
        }

        // Retrieve CDN base URL.
        const api = new GCoreAPI(options.apiKey);
        const resources = await api.getCDNResources();
        if (!resources.length) {
          logError('There is no CDN resource configured');
          process.exit(4);
        }
        const cdnBaseUrl = `https://${resources[0].cname}/${options.s3Bucket}`;

        // Create S3 client and upload all files.
        const s3 = new S3({
          region: options.s3Region,
          endpoint: options.s3Endpoint,
          credentials: {
            accessKeyId: options.s3AccessKey,
            secretAccessKey: options.s3SecretKey,
          },
        });

        const { project } = options;
        logInfo(`Uploading ${chalk.yellow.bold(files.length)} files`);
        logInfo(`Root directory: ${chalk.blue.bold(rootDir)}`);
        logInfo(`Project: ${project}`);

        // TODO: We can make it concurrent, but not sure how S3 client will work in case of a huge
        //  amount of files.
        for (const filePath of files) {
          const paintedFilepath = chalk.yellow(join(...filePath));
          const s3Key = posix.join(project, ...filePath);
          const extension = extname(filePath[filePath.length - 1]).slice(1);

          // Try to guess MIME type, so we could set a correct Content-Type header.
          let guessedMimeType: string | undefined;
          if (extension === 'ts') {
            guessedMimeType = 'text/plain';
          } else if (extension) {
            for (const mimeType in mimeDb) {
              if (mimeDb[mimeType].extensions?.includes(extension)) {
                guessedMimeType = mimeType;
                break;
              }
            }
          }

          await spawnWithSpinner({
            command: () => s3.putObject({
              Bucket: options.s3Bucket,
              Key: s3Key,
              Body: createReadStream(resolve(rootDir, ...filePath)),
              ContentType: guessedMimeType,
            }),
            title: `Uploading: ${paintedFilepath}`,
            titleSuccess: `Uploaded ${paintedFilepath} (${cdnBaseUrl}/${s3Key})`,
            titleFail: `Failed to upload ${paintedFilepath}`,
          });
        }

        logSuccess('Uploaded successfully');
      }),
  );