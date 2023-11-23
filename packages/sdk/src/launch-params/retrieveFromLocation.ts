import { parseLaunchParams } from './parseLaunchParams.js';
import type { LaunchParams } from './types.js';

/**
 * Attempts to extract launch parameters from the current window location hash.
 * @throws {Error} window.location.hash contains invalid data.
 */
export function retrieveFromLocation(): LaunchParams {
  return parseLaunchParams(window.location.hash.slice(1));
}
