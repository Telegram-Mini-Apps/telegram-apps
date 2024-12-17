import { makeTheme } from '@inquirer/core';
import chalk from 'chalk';
import figures from 'figures';

import type { CustomTheme } from './types.js';

/**
 * Creates a custom theme.
 */
export function createCustomTheme(): CustomTheme {
  return makeTheme({
    style: {
      error(text: string): string {
        return chalk.red(text);
      },
      success(text: string): string {
        return chalk.green(text);
      },
      placeholder(text: string): string {
        return chalk.dim(text);
      },
      warning(text: string): string {
        return chalk.yellow(`${figures.warning} ${text}`);
      },
    },
    prefix: {
      idle: chalk.blue('?'),
      done: chalk.green(figures.tick),
      pointer: figures.arrowRight,
    },
  })
}