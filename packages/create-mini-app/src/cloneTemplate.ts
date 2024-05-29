import chalk from 'chalk';

import { spawnWithSpinner } from './spawnWithSpinner.js';
import type { TemplateRepository } from './types.js';

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
    clone: { https, ssh },
    link,
  }: TemplateRepository,
): Promise<void> {
  const titleSuccess = `Cloned template: ${chalk.blue(link)}`;

  // Clone the template using HTTPS.
  try {
    await spawnWithSpinner({
      command: `git clone "${https}" "${rootDir}"`,
      title: `Cloning the template from GitHub (HTTPS): ${chalk.bold.blue(https)}`,
      titleFail: (error) => `Failed to load the template using HTTPS. ${error}`,
      titleSuccess,
    });
    return;
  } catch {
  }

  // Clone the template using SSH.
  await spawnWithSpinner({
    command: `git clone "${ssh}" "${rootDir}"`,
    title: `Cloning the template from GitHub (SSH): ${chalk.bold.blue(ssh)}`,
    titleFail: (error) => `Failed to load the template using SSH. ${error}`,
    titleSuccess,
  });
}
