import { makeTheme } from '@inquirer/core';
import chalk from 'chalk';
import figures from 'figures';

export const theme = makeTheme({
  style: {
    error(text: string): string {
      return chalk.red(text);
    },
    success(text: string): string {
      return chalk.green(text);
    },
    muted(text: string): string {
      return chalk.dim(text);
    },
  },
  prefixes: {
    pending: chalk.blue('?'),
    info: chalk.blue('i'),
    completed: chalk.green(figures.tick),
    pointer: chalk.green(figures.pointer),
  },
});
