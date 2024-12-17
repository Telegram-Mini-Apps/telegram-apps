import chalk from 'chalk';

import { spawnWithSpinner } from './spawnWithSpinner.js';
import type { TemplateRepository } from './templates/types.js';
import type { CustomTheme } from './types.js';

/**
 * Clones the template.
 * @param rootDir - root directory.
 * @param https - repository https link.
 * @param ssh - repository ssh link.
 * @param link - repository GitHub link.
 * @param theme - inquirer theme.
 */
export async function cloneTemplate(
  rootDir: string,
  {
    clone: { https, ssh },
    link,
  }: TemplateRepository,
  theme: CustomTheme,
): Promise<void> {
  const messageSuccess = `Cloned template: ${chalk.blue(link)}`;

  // Clone the template using HTTPS.
  try {
    await spawnWithSpinner({
      command: `git clone "${https}" "${rootDir}"`,
      message: `Cloning the template from GitHub (HTTPS): ${chalk.bold.blue(https)}`,
      messageFail: (error) => `Failed to load the template using HTTPS. ${error}`,
      messageSuccess,
      theme,
    });
    return;
  } catch {
  }

  // Clone the template using SSH.
  await spawnWithSpinner({
    command: `git clone "${ssh}" "${rootDir}"`,
    message: `Cloning the template from GitHub (SSH): ${chalk.bold.blue(ssh)}`,
    messageFail: (error) => `Failed to load the template using SSH. ${error}`,
    messageSuccess,
    theme,
  });
}
