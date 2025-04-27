/**
 * Message log level.
 */
export type LogLevel = 'log' | 'error' | 'warn';

export interface LoggerOptions {
  bgColor?: string;
  textColor?: string;
  /**
   * True if logs are enabled.
   * @default true
   */
  shouldLog?: boolean | (() => boolean);
}

export interface Logger extends Pick<Console, 'log' | 'warn' | 'error'> {
  /**
   * Prints an error message into the console ignoring the `shouldLog` constructor option.
   * @param args - items to log.
   */
  forceError: (...args: any[]) => void,
  /**
   * Prints a log message into the console ignoring the `shouldLog` constructor option.
   * @param args - items to log.
   */
  forceLog: (...args: any[]) => void,
  /**
   * Prints a warning message into the console ignoring the `shouldLog` constructor option.
   * @param args - items to log.
   */
  forceWarn: (...args: any[]) => void,
}

/*@__NO_SIDE_EFFECTS__*/
export function createLogger(scope: string, options?: LoggerOptions): Logger {
  options ||= {};
  const {
    textColor,
    bgColor,
    shouldLog: optionsShouldLog,
  } = options;
  const shouldLogValue = optionsShouldLog === undefined ? true : optionsShouldLog;
  const shouldLog = typeof shouldLogValue === 'boolean'
    ? () => shouldLogValue
    : shouldLogValue;

  /**
   * Prints a message into the console.
   * @param level - log level.
   * @param force - should `shouldLog` value be ignored.
   * @param args - arguments.
   */
  const print = (level: LogLevel, force: boolean, ...args: any[]): void => {
    if (force || shouldLog()) {
      const commonCss = 'font-weight:bold;padding:0 5px;border-radius:100px';
      const [timeBgColor, timeTextColor, prefix] = {
        log: ['#0089c3', 'white', 'INFO'],
        error: ['#ff0000F0', 'white', 'ERR'],
        warn: ['#D38E15', 'white', 'WARN'],
      }[level];
      console[level](
        `%c${prefix} ${
          Intl
            .DateTimeFormat('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              fractionalSecondDigits: 3,
              timeZone: 'UTC',
            })
            .format(new Date())
        }%c %c${scope}`,
        `${commonCss};background-color:${timeBgColor};color:${timeTextColor}`,
        '',
        `${commonCss};${textColor ? `color:${textColor};` : ''}${bgColor ? `background-color:${bgColor}` : ''}`,
        ...args,
      );
    }
  };

  return ([
    ['log', 'forceLog'],
    ['warn', 'forceWarn'],
    ['error', 'forceError'],
  ] as const).reduce<Logger>((acc, [level, forceMethod]) => {
    acc[level] = print.bind(undefined, level);
    acc[forceMethod] = acc[level].bind(null, true);
    return acc;
  }, {} as Logger);
}