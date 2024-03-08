import { existsSync } from 'node:fs';
import { basename } from 'node:path';

import chalk from 'chalk';
import inquirer from 'inquirer';

import { toAbsolute } from './toAbsolute.js';

interface Answers {
  rootDir: string;
  confirmed: boolean;
}

/**
 * Prompts current user project root directory.
 * @returns Directory name.
 */
export async function promptRootDir(): Promise<string | null> {
  return inquirer
    .prompt<Answers>([{
      type: 'input',
      name: 'rootDir',
      message: 'Enter the directory name:',
      validate(value) {
        if (value.length === 0) {
          return 'Directory name should not be empty.';
        }

        const dir = toAbsolute(value);
        if (existsSync(dir)) {
          return `Directory already exists: ${dir}`;
        }

        if (value !== basename(value)) {
          return `Value "${value}" contains invalid symbols.`;
        }

        return true;
      },
    }, {
      type: 'confirm',
      name: 'confirmed',
      message({ rootDir }) {
        return `Is this your desired directory? ${chalk.green(toAbsolute(rootDir))}`;
      },
    }])
    .then(({ rootDir, confirmed }) => (confirmed ? rootDir : null));
}
