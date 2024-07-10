import chalk from 'chalk';

/**
 * Message log level.
 */
export type LogLevel = 'log' | 'error';

export class Logger {
  /**
   * Prints message into a console in case, logger is currently enabled.
   * @param level - log level.
   * @param args - arguments.
   */
  private print(level: LogLevel, ...args: any[]): void {
    const now = new Date();
    const date = Intl
      .DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
      })
      .format(now);

    console[level](chalk.bold.whiteBright.bgGreen(` ${date} `), ...args);
  }

  /**
   * Prints a log message into a console.
   * @param args
   */
  log(...args: any[]): void {
    this.print('log', chalk.whiteBright.bgBlue(' i '), ...args);
  }
}
