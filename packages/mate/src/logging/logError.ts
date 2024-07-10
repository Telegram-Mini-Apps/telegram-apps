import chalk from 'chalk';
import figureSet from 'figures';

/**
 * Prints out an error message into the console.
 * @param args
 */
export function logError(...args: any[]): void {
  console.log(chalk.red(figureSet.cross, ...args));
}
