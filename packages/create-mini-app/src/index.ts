#!/usr/bin/env node
import process from 'node:process';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

import chalk from 'chalk';
import { program } from 'commander';

import { cloneTemplate } from './cloneTemplate.js';
import { isGitInstalled } from './isGitInstalled.js';
import { promptTemplate } from './prompts/promptTemplate/promptTemplate.js';
import { promptDirName } from './prompts/promptDirName.js';
import { promptGitRepo } from './prompts/promptGitRepo.js';
import { spawnWithSpinner } from './spawnWithSpinner.js';
import { lines } from './utils/lines.js';
import type { TemplateRepository } from './types.js';

import packageJson from '../package.json';

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .action(async () => {
    // Check if git is installed.
    if (!await isGitInstalled()) {
      console.error('To run this CLI tool, you must have git installed. Installation guide: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git');
      process.exit(1);
    }

    // Prompt the project root directory name.
    let rootDir: string | null = null;
    try {
      rootDir = await promptDirName({ defaultValue: 'mini-app' });
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

    // Prompt Git repo information.
    let gitRepo: string | undefined;
    try {
      gitRepo = await promptGitRepo({});
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
        title: 'Removing the .git directory.',
        command: () => rm(resolve(rootDir, '.git'), { recursive: true }),
        titleFail: (err: string) => `Failed to remove the .git directory. Error: ${err}`,
        titleSuccess: '.git directory removed.',
      });
    } catch {
      process.exit(1);
    }

    // Initialize new .git folder if required.
    if (gitRepo) {
      try {
        await spawnWithSpinner({
          title: `Initializing Git repository: ${gitRepo}`,
          command: [
            `cd "${rootDir}"`,
            'git init',
            'git add -A',
            'git commit -m "first commit"',
            'git branch -M master',
            `git remote add origin "${gitRepo}"`,
            'git push -u origin master',
          ].join(' && '),
          titleFail: (error) => `Failed to initialize Git repository. ${error}`,
          titleSuccess: 'Git repository initialized.',
        })
      } catch {
        // We are not doing anything as long as this step is not really that important.
        // Nevertheless, a developer will be notified about something went wrong.
      }
    }

    console.log(
      lines(
        chalk.green.bold('Your project has been successfully initialized!'),
        `Now, open the "${chalk.bold(rootDir)}" directory and follow the instructions presented in the ${chalk.bold('README.md')} file. ${chalk.bold('Happy coding! 🚀')}`,
      ),
    );
  });

program.parse();
