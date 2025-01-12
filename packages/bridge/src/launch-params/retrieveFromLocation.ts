import type { LaunchParamsShape } from '@telegram-apps/transformers';

import { retrieveFromUrl } from './retrieveFromUrl.js';

/**
 * @returns Launch parameters from the current window location hash.
 * @throws Error if function was unable to extract launch parameters from the window location hash.
 */
export function retrieveFromLocation(): LaunchParamsShape {
  return retrieveFromUrl(window.location.href);
}
