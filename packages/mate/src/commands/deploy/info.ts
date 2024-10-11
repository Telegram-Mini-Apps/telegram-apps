import { Command } from 'commander';
import chalk from 'chalk';
import { pipe } from 'ramda';

import { DEFAULT_ENDPOINT, DEFAULT_TAG } from '@/const.js';
import { hl } from '@/chalk/hl.js';

import { injectLoggers } from '@/piping/injectLoggers.js';
import { logArgs } from '@/piping/logArgs.js';
import { injectConfig } from '@/piping/injectConfig.js';
import { optionsToArgs } from '@/piping/optionsToArgs.js';
import { injectDeployBaseProps } from '@/piping/injectDeployBaseProps.js';
import { getDeploymentInfo } from '@/operations/getDeploymentInfo.js';
import { formatSize } from '@/formatSize.js';

export const info = new Command()
  .name('info')
  .description('Prints the link, which will be used as a base path for all uploaded files associated with the specified project name')
  .option('--verbose', 'enables debug mode')
  .option('-e, --endpoint <endpoint>', 'API endpoint')
  .option('-c, --config <config path>', 'mate configuration location')
  .option('--tag <tag name>', 'specific version name')
  .option('--token <deploy token>', 'token used to deploy the project')
  .option('-p, --project <project id>', 'project identifier. Example: 191', Number)
  .action(
    pipe(
      optionsToArgs<{
        config?: string;
        endpoint?: string;
        tag?: string;
        token?: string;
        project?: number;
        verbose?: boolean;
      }>,
      injectLoggers,
      logArgs,
      injectConfig,
      injectDeployBaseProps({ endpoint: DEFAULT_ENDPOINT, tag: DEFAULT_TAG }),
      async ({ project, tag, endpoint, token }) => {
        const info = await getDeploymentInfo({
          endpoint,
          token,
          tag,
          project,
        }).catch(() => process.exit(1));

        function logItem(title: string, value: string, hint: string): void {
          console.log(`${chalk.bold(title + ':')} ${value}\n` + chalk.grey(hint));
        }

        function logSeparator() {
          console.log(chalk.grey('--------'));
        }

        logItem('Title', hl(info.project.title), 'Short title of the project');
        logSeparator();
        logItem(`Assets base path (using tag ${hl(tag)})`, info.basePath, [
          'This path will be used as a base path for the uploaded assets associated with this project. Consider using this value as a base path in your bundler. '
          + `You can also use different tags using the ${chalk.bold.white('--tag')} option`,
        ].join('\n'));
        logSeparator();
        logItem(
          'Allowed file extensions',
          info.allowedExtensions.map(ext => hl(ext)).join(', '),
          'Files extensions which are allowed to be uploaded',
        );
        logSeparator();
        logItem('Maximum upload size', hl(formatSize(info.maxSize)), 'Maximum upload size');
        logSeparator();
        logItem(
          'Maximum files count', hl(info.maxFilesCount),
          'Maximum files count a single upload can contain',
        );
      },
    ),
  );