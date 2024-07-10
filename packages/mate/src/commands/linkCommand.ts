import { Command } from 'commander';
import chalk from 'chalk';
import figureSet from 'figures';

import { createGCoreDeployProvider } from '../providers/createGCoreDeployProvider.js';
import { Logger } from '../logger/Logger.js';

export const linkCommand = new Command()
  .name('link')
  .description('Prints the link, which can be used to retrieve the application assets')
  .addCommand(
    new Command('gcore')
      .option('--verbose', 'enable debug mode')
      .requiredOption('--s3-access-key <key>', 'S3 access key id')
      .requiredOption('--s3-secret-key <key>', 'S3 secret access key')
      .requiredOption('--s3-endpoint <endpoint>', 'S3 endpoint')
      .requiredOption('--s3-region <region>', 'S3 region identifier')
      .requiredOption('--s3-bucket <bucket name>', 'S3 bucket name')
      .requiredOption('--api-key <key>', 'gcore API Key')
      .requiredOption('-p, --project <project name>', 'project identifier. Example: "my-mini-app"')
      .action(async (options: {
        apiKey: string;
        project: string;
        s3AccessKey: string;
        s3Bucket: string;
        s3Endpoint: string;
        s3Region: string;
        s3SecretKey: string;
        verbose: boolean;
      }) => {
        const { project } = options;
        const logger = options.verbose ? new Logger() : undefined;

        logger?.log('Using options:', options);

        const provider = createGCoreDeployProvider({
          apiKey: options.apiKey,
          s3: {
            accessKeyId: options.s3AccessKey,
            bucket: options.s3Bucket,
            secretAccessKey: options.s3SecretKey,
            endpoint: options.s3Endpoint,
            region: options.s3Region,
          },
        });

        // TODO: handle error.

        const link = await provider.getLink(project);

        if (link) {
          console.log(
            chalk.bold.green(figureSet.tick),
            `Project ${chalk.bold.yellow(project)} link: ${chalk.bold.blue(link)}`,
          );
        } else {
          console.log(
            chalk.bold.yellow(figureSet.warning),
            `Project ${chalk.bold.yellow(project)} is not yet deployed`,
          );
        }
      }),
  );