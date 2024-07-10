import chalk from 'chalk';
import figureSet from 'figures';

/**
 * Prints out a success message into the console.
 * @param args
 */
export function logSuccess(...args: any[]): void {
  console.log(chalk.green(figureSet.tick), ...args);
}
