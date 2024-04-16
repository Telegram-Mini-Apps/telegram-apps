import { singletonEmitter } from '@/bridge/events/singletonEmitter.js';
import { Logger } from '@/logger/Logger.js';

export interface LogLevel {
  postEvent?: boolean;
  rawEvent?: boolean;
  emittedEvent?: boolean;
}

/**
 * @internal
 */
export const logger = new Logger('SDK', {
  bgColor: 'forestgreen',
  textColor: 'white',
});

const logLevel: LogLevel = {};

/**
 * Sets new debug mode. Enabling debug mode leads to printing additional messages in the console,
 * related to the processes inside the package.
 * @param value - debug level. True enables default mode. False completely disables debugging.
 * Object should be passed to precisely set debug level.
 */
export function setDebug(value: boolean | Partial<LogLevel>): void {
  Object.assign(
    logLevel,
    typeof value === 'object'
      ? { ...logLevel, ...value }
      : value
        ? { postEvent: true, emittedEvent: true }
        : {},
  );

  // We are just getting the singleton global emitter to make sure, we will create a single
  // instance of Telegram Mini App events handler.
  singletonEmitter();
}

/**
 * Logs info message into the console.
 * @param debugLevel - required debug level.
 * @param args - additional arguments.
 */
export function log(debugLevel: keyof LogLevel, ...args: any[]): void {
  if (logLevel[debugLevel]) {
    logger.log(...args);
  }
}

/**
 * Logs error message into the console.
 * @param args - additional arguments.
 */
export function error(...args: any[]): void {
  logger.error(...args);
}
