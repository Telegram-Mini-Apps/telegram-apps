/**
 * Message log level.
 */
export type LogLevel = 'log' | 'error';

export interface LoggerOptions {
  bgColor?: string;
  textColor?: string;
}

export function createLogger(scope: string, options?: LoggerOptions): [
  log: (...args: any[]) => void,
  error: (...args: any[]) => void,
] {
  options ||= {};
  const { textColor, bgColor } = options;

  /**
   * Prints message into a console in case, logger is currently enabled.
   * @param level - log level.
   * @param args - arguments.
   */
  function print(level: LogLevel, ...args: any[]): void {
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

    const commonCss = 'font-weight: bold;padding: 0 5px;border-radius:5px';
    console[level](
      `%c${date}%c / %c${scope}`,
      `${commonCss};background-color: lightblue;color:black`,
      '',
      `${commonCss};${textColor ? `color:${textColor};` : ''}${bgColor ? `background-color:${bgColor}` : ''}`,
      ...args,
    );
  }

  return [
    /**
     * Prints log message into a console.
     * @param args
     */
    function log(...args: any[]): void {
      print('log', ...args);
    },
    /**
     * Prints error message into a console.
     * @param args
     */
    function error(...args: any[]): void {
      print('error', ...args);
    },
  ];
}