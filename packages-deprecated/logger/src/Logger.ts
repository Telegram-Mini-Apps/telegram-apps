import type { LogLevel } from './types.js';

export class Logger {
  constructor(private readonly prefix: string, private enabled: boolean) {
  }

  /**
   * Prints message into a console in case, logger is currently enabled.
   * @param level - log level.
   * @param args - arguments.
   */
  private print(level: LogLevel, ...args: any[]): void {
    if (!this.enabled) {
      return;
    }

    const now = new Date();
    const date = Intl
      .DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        timeZone: 'UTC',
      })
      .format(now);

    console[level](`[${date}]`, this.prefix, ...args);
  }

  /**
   * Disables the logger.
   */
  disable() {
    this.enabled = false;
  }

  /**
   * Prints error message into a console.
   * @param args
   */
  error(...args: any[]): void {
    this.print('error', ...args);
  }

  /**
   * Enables the logger.
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Prints log message into a console.
   * @param args
   */
  log(...args: any[]): void {
    this.print('log', ...args);
  }

  /**
   * Prints warning message into a console.
   * @param args
   */
  warn(...args: any[]): void {
    this.print('warn', ...args);
  }
}
