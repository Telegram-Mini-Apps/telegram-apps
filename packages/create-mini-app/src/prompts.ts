import { existsSync } from 'node:fs';
import { basename } from 'node:path';

import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';

import { templatePrompt } from './prompts/templatePrompt.js';
import { toAbsolute } from './toAbsolute.js';
import type { AnyTemplate } from './types.js';

/**
 * Prompts current user project root directory.
 * @returns Directory name.
 */
export async function promptRootDir(): Promise<string | null> {
  const rootDir = await input({
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
  });

  const confirmed = await confirm({
    message: `Is this your desired directory? ${chalk.green(toAbsolute(rootDir))}`,
  });

  return confirmed ? rootDir : null;
}

/**
 * Prompts a preferred template.
 */
export async function promptTemplate(): Promise<AnyTemplate> {
  return templatePrompt({});
}
