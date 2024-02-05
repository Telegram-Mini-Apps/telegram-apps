import { retrieveFromUrl } from './retrieveFromUrl.js';
import type { LaunchParams } from './types.js';

/**
 * Attempts to extract launch parameters from the current window location hash.
 * @throws {Error} window.location.hash contains invalid data.
 */
export function retrieveFromLocation(): LaunchParams {
  return retrieveFromUrl(window.location.href);
}
