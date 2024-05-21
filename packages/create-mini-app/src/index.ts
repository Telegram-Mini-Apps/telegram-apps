#!/usr/bin/env node
import process from 'node:process';
import { rm } from 'node:fs/promises';

import chalk from 'chalk';
import { program } from 'commander';

import { cloneTemplate } from './cloneTemplate.js';
import { isGitInstalled } from './isGitInstalled.js';
import { promptRootDir } from './prompts/promptRootDir.js';
import { promptTemplate } from './prompts/promptTemplate.js';
import { spawnWithSpinner } from './spawnWithSpinner.js';
import type { TemplateRepository } from './types.js';

import packageJson from '../package.json';
import { resolve } from 'node:path';
import { lines } from './utils/lines.js';
import { theme } from './theme.js';

const { red } = chalk;

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .action(async () => {
    console.clear();

    // Check if git is installed.
    if (!await isGitInstalled()) {
      console.error('To run this CLI tool, you must have git installed. Installation guide: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git');
      process.exit(1);
    }

    // Prompt the project root directory name.
    let rootDir: string | null = null;
    try {
      rootDir = await promptRootDir({});
    } catch {
      process.exit(0);
    }

    // Prompt the target template.
    let repository: TemplateRepository;
    try {
      const { repository: promptRepo } = await promptTemplate({});
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
        title: theme.style.message('Removing the .git folder'),
        command() {
          return rm(resolve(rootDir, '.git'), { recursive: true });
        },
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

    console.log(
      lines(
        chalk.green(
          chalk.bold('Your project has been successfully initialized!'),
        ),
        `Now, open the "${chalk.bold(rootDir)}" directory and follow the instructions presented in the ${chalk.bold('README.md')} file. ${chalk.bold('Happy coding! 🚀')}`,
      ),
    );
  });

program.parse();
