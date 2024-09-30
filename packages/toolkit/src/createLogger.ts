/**
 * Message log level.
 */
export type LogLevel = 'log' | 'error';

export interface LoggerOptions {
  bgColor?: string;
  textColor?: string;
  /**
   * Should return true if log should be outputted.
   * @default All logs will be outputted.
   */
  shouldLog?: boolean | (() => boolean);
}

/*@__NO_SIDE_EFFECTS__*/
export function createLogger(scope: string, options?: LoggerOptions): [
  /**
   * Prints log message into a console.
   * @param args
   */
  log: (...args: any[]) => void,
  /**
   * Prints error message into a console.
   * @param args
   */
  error: (...args: any[]) => void,
] {
  options ||= {};
  const {
    textColor,
    bgColor,
    shouldLog = true,
  } = options;

  /**
   * Prints message into a console in case, logger is currently enabled.
   * @param level - log level.
   * @param args - arguments.
   */
  function print(level: LogLevel, ...args: any[]): void {
    if (!shouldLog || (typeof shouldLog === 'function' && !shouldLog())) {
      return;
    }
    const commonCss = 'font-weight:bold;padding:0 5px;border-radius:5px';
    console[level](
      `%c${
        Intl
          .DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3,
            timeZone: 'UTC',
          })
          .format(new Date())
      }%c / %c${scope}`,
      `${commonCss};background-color: lightblue;color:black`,
      '',
      `${commonCss};${textColor ? `color:${textColor};` : ''}${bgColor ? `background-color:${bgColor}` : ''}`,
      ...args,
    );
  }

  return [
    function log(...args: any[]): void {
      print('log', ...args);
    },
    function error(...args: any[]): void {
      print('error', ...args);
    },
  ];
}