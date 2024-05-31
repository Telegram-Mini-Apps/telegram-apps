/**
 * Message log level.
 */
export type LogLevel = 'log' | 'error';

export interface LoggerOptions {
  bgColor?: string;
  textColor?: string;
}

export class Logger implements Pick<Console, 'log' | 'error'> {
  constructor(
    private readonly scope: string,
    private readonly options: LoggerOptions = {},
  ) {
  }

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
        timeZone: 'UTC',
      })
      .format(now);

    const { textColor, bgColor } = this.options;
    const commonCss = 'font-weight: bold;padding: 0 5px;border-radius:5px';

    console[level](
      `%c${date}%c / %c${this.scope}`,
      `${commonCss};background-color: lightblue;color:black`,
      '',
      `${commonCss};${textColor ? `color:${textColor};` : ''}${bgColor ? `background-color:${bgColor}` : ''}`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ...args,
    );
  }

  /**
   * Prints error message into a console.
   * @param args
   */
  error(...args: any[]): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.print('error', ...args);
  }

  /**
   * Prints log message into a console.
   * @param args
   */
  log(...args: any[]): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.print('log', ...args);
  }
}
