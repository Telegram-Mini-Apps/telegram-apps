import chalk from 'chalk';
import figureSet from 'figures';

/**
 * Prints out a warning message into the console.
 * @param args
 */
export function logWarning(...args: any[]): void {
  console.log(chalk.yellow(figureSet.warning), ...args);
}