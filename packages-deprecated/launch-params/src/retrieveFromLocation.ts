import { parse } from './parse.js';
import type { LaunchParams } from './types.js';

/**
 * Attempts to extract launch parameters from the current window location hash.
 * @throws {Error} window.location.hash contains invalid data.
 */
export function retrieveFromLocation(): LaunchParams {
  return parse(window.location.hash.slice(1));
}
