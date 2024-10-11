import type { Logger } from '@/logging.js';
import { type Config, retrieveConfig } from '@/config.js';
import type { CommandOptions, OmitMerge } from '@/piping/types.js';

/**
 * Retrieves the mate config and injects in the output.
 * @param options - command options.
 */
export function injectConfig<O extends CommandOptions<{
  config?: string;
  logger?: Logger;
  verboseLogger?: Logger;
}>>(options: O): OmitMerge<O, { config: Config | undefined }> {
  const {
    verboseLogger,
    logger,
    config: configPath,
  } = options.args;

  const config = retrieveConfig({
    onInvalid: p => logger?.warn(p),
    path: configPath,
  });
  config
    ? verboseLogger?.debug('Config retrieved:', config)
    : verboseLogger?.debug('No config found');

  return { ...options, config };
}