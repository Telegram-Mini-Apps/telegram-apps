import { singletonEmitter } from '@/bridge/events/singletonEmitter.js';
import { Logger, type LogLevel as LoggerLogLevel } from '@/logger/Logger.js';

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

function createLogFn(loggerLevel: LoggerLogLevel) {
  return (debugLevel: keyof LogLevel | null, ...args: any[]): void => {
    if (!debugLevel || logLevel[debugLevel]) {
      logger[loggerLevel](...args);
    }
  };
}

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

export const log = createLogFn('log');
export const error = createLogFn('error');
