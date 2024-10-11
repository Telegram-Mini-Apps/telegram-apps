import type { Logger } from '@/logging.js';
import { CommandOptions } from '@/piping/types.js';

/**
 * Outputs command arguments.
 * @param options - command options.
 */
export function logArgs<O extends CommandOptions<{}, { verboseLogger: Logger }>>(options: O): O {
  options.verboseLogger.debug('Command arguments:', options.args);
  return options;
}