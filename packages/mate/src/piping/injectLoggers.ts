import { createLogger, createVerboseLogger, type Logger } from '@/logging.js';
import type { CommandOptions, OmitMerge } from './types.js';

/**
 * Injects basic loggers.
 * @param options - command options.
 */
export function injectLoggers<O extends CommandOptions<{ verbose?: boolean }>>(
  options: O,
): OmitMerge<O, {
  logger: Logger;
  verbose: boolean;
  verboseLogger: Logger;
}> {
  const verbose = options.args.verbose || false;
  return {
    ...options,
    logger: createLogger(verbose),
    verbose,
    verboseLogger: createVerboseLogger(verbose),
  };
}