import { launchParams } from './parsers/launchParams.js';
import type { LaunchParams } from './types.js';

/**
 * Parses value as launch parameters.
 * @param value - value to parse.
 */
export function parseLaunchParams(value: unknown): LaunchParams {
  return launchParams().parse(value);
}
