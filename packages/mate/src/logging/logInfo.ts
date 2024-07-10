import chalk from 'chalk';

/**
 * Prints out an info message into the console.
 * @param args
 */
export function logInfo(...args: any[]): void {
  console.log(chalk.whiteBright.bgBlue('i'), ...args);
}