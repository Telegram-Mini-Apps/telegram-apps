#!/usr/bin/env node
import process from 'node:process';

import chalk from 'chalk';
import { program } from 'commander';

import { cloneTemplate } from './cloneTemplate.js';
import { isGitInstalled } from './isGitInstalled.js';
import { promptRootDir, promptTemplate } from './prompts.js';
import { spawnWithSpinner } from './spawnWithSpinner.js';
import type { TemplateRepository } from './types.js';
import packageJson from '../package.json';

const { bold, green, red } = chalk;

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .action(async () => {
    // Check if git is installed.
    if (!await isGitInstalled()) {
      console.error('To run this CLI tool, git is required. Installation guide: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git');
      process.exit(1);
    }

    // Prompt the project root directory name.
    let rootDir: string | null = null;
    while (!rootDir) {
      console.clear();
      try {
        rootDir = await promptRootDir();
      } catch {
        process.exit(0);
      }
    }

    // Prompt the target template.
    let repository: TemplateRepository;
    try {
      const { repository: promptRepo } = await promptTemplate();
      repository = promptRepo;
    } catch {
      process.exit(0);
    }

    // Clone the template.
    try {
      await cloneTemplate(rootDir, repository);
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
      `Now, open the "${bold(rootDir)}" directory and follow the instructions presented in the ${bold('README.md')} file. ${bold('Happy coding! 🚀')}`,
    ].join('\n'));
  });

program.parse();
