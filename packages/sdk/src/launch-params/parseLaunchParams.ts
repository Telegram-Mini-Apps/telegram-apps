import { launchParamsParser } from './launchParamsParser.js';
import type { LaunchParams } from './types.js';

/**
 * Parses value as launch parameters.
 * @param value - value to parse.
 */
export function parseLaunchParams(value: unknown): LaunchParams {
  return launchParamsParser().parse(value);
}
