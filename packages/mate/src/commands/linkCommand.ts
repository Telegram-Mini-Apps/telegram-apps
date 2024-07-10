import { Command } from 'commander';

import { createGCoreDeployProvider } from '../providers/createGCoreDeployProvider.js';

export const linkCommand = new Command()
  .name('link')
  .description('Prints the link, which can be used to retrieve the application assets')
  .addCommand(
    new Command()
      .name('gcore')
      .option('-d, --debug', 'enable debug mode')
      .requiredOption('-k, --key <key>', 'gcore API Key')
      .requiredOption('-p, --project <project name>', 'project identifier. Example: "my-mini-app"')
      .action(async (options: { project: string; key: string; debug: boolean }) => {
        const { project, key, debug } = options;
        if (debug) {
          console.log('Using options:', options);
        }

        const provider = createGCoreDeployProvider(key);
        const link = await provider.getLink(project);

        if (link) {
          console.log(`Project "${project}" link: ${link}`);
        } else {
          console.log(`Project "${project}" is not yet deployed`);
        }
      }),
  );