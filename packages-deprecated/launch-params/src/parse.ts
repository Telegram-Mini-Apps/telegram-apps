import { launchParams } from './launchParams.js';
import type { LaunchParams } from './types.js';

/**
 * Parses incoming value as launch parameters.
 * @param value - value to parse.
 * @throws {Error} Value contains invalid data.
 */
export function parse(value: unknown): LaunchParams {
  return launchParams().parse(value);
}
