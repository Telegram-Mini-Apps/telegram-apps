import chalk from 'chalk';

/**
 * Performs default text highlight.
 * @param text - text to highlight.
 */
export function hl(...text: unknown[]): string {
  return chalk.yellow.bold(text);
}