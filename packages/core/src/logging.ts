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
    .DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .format(now);
  const ms = now.getMilliseconds().toString();

  console[level](`[${date}.${'0'.repeat(3 - ms.length) + ms}]`, ...args);
}