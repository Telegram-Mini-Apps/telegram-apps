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
    }
  },
  prefixes: {
    pending: chalk.green('?'),
    info: chalk.blue('i'),
    completed: chalk.green(figures.tick),
  },
});
