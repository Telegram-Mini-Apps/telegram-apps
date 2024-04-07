import chalk from 'chalk';

import { spawnWithSpinner } from './spawnWithSpinner.js';
import type { TemplateRepository } from './types.js';

const { bold, blue, red } = chalk;

/**
 * Clones the template.
 * @param rootDir - root directory.
 * @param https - repository https link.
 * @param ssh - repository ssh link.
 * @param link - repository GitHub link.
 */
export async function cloneTemplate(
  rootDir: string,
  {
    clone: {
      https,
      ssh,
    },
    link,
  }: TemplateRepository,
): Promise<void> {
  const titleSuccess = bold(`Template was cloned: ${blue(link)}`);

  // Clone the template using https.
  try {
    await spawnWithSpinner({
      title: `Cloning the template from GitHub (HTTPS): ${bold(blue(link))}`,
      command: `git clone ${https} ${rootDir}`,
      titleFail(outputOrCode) {
        return `Failed to load the template using HTTPS. ${
          typeof outputOrCode === 'string'
            ? `Error: ${red(outputOrCode)}`
            : `Error code: ${red(outputOrCode)}`
        }`;
      },
      titleSuccess,
    });
    return;
  } catch (e) { /* empty */
  }

  // Clone the template using ssh.
  await spawnWithSpinner({
    title: `Cloning the template from GitHub (SSH): ${bold(blue(link))}`,
    command: `git clone ${ssh} ${rootDir}`,
    titleFail(outputOrCode) {
      return `Failed to load the template using SSH. ${
        typeof outputOrCode === 'string'
          ? `Error: ${red(outputOrCode)}`
          : `Error code: ${red(outputOrCode)}`
      }`;
    },
    titleSuccess,
  });
}
