/**
 * Message log level.
 */
export type LogLevel = 'log' | 'error' | 'warn';

/**
 * Logs message into console.
 * @param level - log level.
 * @param args - arguments.
 */
export function log(level: LogLevel, ...args: any[]): void {
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

  console[level](`[${date}]`, ...args);
}
