import type { LaunchParams } from '@telegram-apps/types';

import { retrieveFromUrl } from './retrieveFromUrl.js';

/**
 * @returns Launch parameters from the current window location hash.
 * @throws Error if function was unable to extract launch parameters from the window location hash.
 */
export function retrieveFromLocation(): LaunchParams {
  return retrieveFromUrl(window.location.href);
}
