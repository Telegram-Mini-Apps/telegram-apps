import process from 'node:process';

import chalk from 'chalk';
import { program } from 'commander';

import { isGitInstalled } from './isGitInstalled.js';
import { promptRootDir } from './promptRootDir.js';
import { spawnWithSpinner } from './spawnWithSpinner.js';
import { filterTemplates } from './templates.js';
import packageJson from '../package.json';

const { bold, green, blue, red } = chalk;

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .action(async () => {
    // Check if git is installed.
    if (!await isGitInstalled()) {
      console.error('To run this CLI tool, git should be installed. Installation guide: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git');
      process.exit(1);
    }

    // Prompt the project root directory name.
    let rootDir: string | null = null;
    while (!rootDir) {
      console.clear();
      rootDir = await promptRootDir();
    }

    const [{ repository: { clone, link } }] = filterTemplates('ts', 'tma.js', 'react');

    // Clone the template.
    try {
      await spawnWithSpinner({
        title: `Cloning the template from GitHub: ${bold(blue(link))}`,
        command: `git clone ${clone} ${rootDir}`,
        titleFail(outputOrCode) {
          return `Failed to load the template. ${
            typeof outputOrCode === 'string'
              ? `Error: ${red(outputOrCode)}`
              : `Error code: ${red(outputOrCode)}`
          }`;
        },
        titleSuccess: `Cloned the template: ${bold(blue(link))}`,
      });
    } catch {
      process.exit(1);
    }

    // Remove the .git folder.
    try {
      await spawnWithSpinner({
        title: 'Removing the .git folder',
        command: `rm -rf ${rootDir}/.git`,
        titleFail(outputOrCode) {
          return `Failed to delete .git directory ${
            typeof outputOrCode === 'string'
              ? `Error: ${red(outputOrCode)}`
              : `Error code: ${red(outputOrCode)}`
          }`;
        },
        titleSuccess: '.git folder removed',
      });
    } catch {
      process.exit(1);
    }

    console.log([
      green(bold('Your project has been successfully initialized!')),
      `Now, open the ${bold(rootDir)} directory and follow the instructions presented in the ${bold('README.md')} file.`,
    ].join('\n'));
  });

program.parse();
