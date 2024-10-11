import figureSet from 'figures';
import chalk from 'chalk';

export function timestamp(): string {
  const now = new Date();
  const date = Intl
    .DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    })
    .format(now);
  return chalk.grey(`[${date}]`);
}

function withTs(fn: (...args: any[]) => void) {
  return function logWithTs(ts: boolean, ...args: any[]) {
    ts && args.unshift(timestamp());
    fn(...args);
  };
}

const logSuccess = withTs((...args) => console.log(chalk.green(figureSet.tick), ...args));
const logWarning = withTs((...args) => console.warn(chalk.yellow(figureSet.warning), ...args));
const logInfo = withTs((...args) => console.info(chalk.whiteBright.bgBlue('i'), ...args));
const logError = withTs((...args) => console.error(chalk.red(figureSet.cross, ...args)));
const logDebug = withTs((...args) => console.debug(chalk.cyan(figureSet.lozenge), ...args));

export interface Logger {
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  success: (...args: any[]) => void;
}

export function createLogger(includeTimestamp: boolean): Logger {
  function withTs<Fn extends (...args: any) => any>(fn: Fn): Fn {
    return ((...args: any) => fn(includeTimestamp, ...args)) as Fn;
  }

  return {
    error: withTs(logError),
    debug: withTs(logDebug),
    info: withTs(logInfo),
    warn: withTs(logWarning),
    success: withTs(logSuccess),
  };
}

export function createVerboseLogger(enabled: boolean): Logger {
  function withEnabled<Fn extends (...args: any) => any>(fn: Fn): Fn {
    return ((...args: any) => {
      enabled && fn(...args);
    }) as Fn;
  }

  const { error, info, warn, success, debug } = createLogger(true);

  return {
    error: withEnabled(error),
    debug: withEnabled(debug),
    info: withEnabled(info),
    warn: withEnabled(warn),
    success: withEnabled(success),
  };
}