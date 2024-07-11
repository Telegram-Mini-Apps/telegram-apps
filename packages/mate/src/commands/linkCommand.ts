import { S3 } from '@aws-sdk/client-s3';
import { Command } from 'commander';
import chalk from 'chalk';

import { spawnWithSpinner } from '@/cli-utils/spawnWithSpinner.js';

import { Logger } from '../logging/Logger.js';
import { logSuccess } from '../logging/logSuccess.js';
import { logWarning } from '../logging/logWarning.js';
import { GCoreAPI } from '../lib/GCoreAPI.js';

export const linkCommand = new Command()
  .name('link')
  .description('Prints the link, which can be used to retrieve the project assets')
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
        const logger = options.verbose ? new Logger() : undefined;
        logger?.log('Using options:', options);

        const { project } = options;
        const api = new GCoreAPI(options.apiKey);
        const s3 = new S3({
          region: options.s3Region,
          endpoint: options.s3Endpoint,
          credentials: {
            accessKeyId: options.s3AccessKey,
            secretAccessKey: options.s3SecretKey,
          },
        });

        // TODO: handle error.
        // TODO: format project.

        const link = await spawnWithSpinner({
          async command() {
            // Retrieve any objects, having the project name as a prefix.
            // We use the project name as a bucket directory.
            const response = await s3.listObjects({
              Bucket: options.s3Bucket,
              Prefix: `${project}/`,
              MaxKeys: 1,
            });
            if (!response.Contents?.length) {
              return;
            }

            // Publicly, objects are only available via CDN.
            const resources = await api.getCDNResources();
            if (resources.length > 0) {
              return `https://${resources[0].cname}/${options.s3Bucket}/${project}`;
            }
          },
          title: 'Fetching project information',
          titleFail: 'Unable to retrieve project information. Something went wrong',
          titleSuccess: 'Project information fetched',
        });

        if (link) {
          logSuccess(`Project ${chalk.bold.yellow(project)} link: ${chalk.bold.blue(link)}`);
        } else {
          logWarning(`Project ${chalk.bold.yellow(project)} is not yet deployed`);
        }
      }),
  );