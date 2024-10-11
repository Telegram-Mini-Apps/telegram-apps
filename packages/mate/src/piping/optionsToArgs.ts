import { OmitMerge } from '@/piping/types.js';

/**
 * Move passed options to the args property.
 * @param options - command options.
 */
export function optionsToArgs<O extends {}>(options: O): OmitMerge<O, { args: O }> {
  return { ...options, args: options };
}