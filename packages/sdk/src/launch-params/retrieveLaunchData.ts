import { isPageReload } from '~/misc/index.js';

import { retrieveLaunchParams } from './retrieveLaunchParams.js';
import type { LaunchData } from './types.js';

/**
 * Returns launch data information. Function ignores passed options in case, it was already
 * called. It caches the last returned value.
 * @deprecated Use `retrieveLaunchParams` and `isPageReload` functions separately where required.
 */
export function retrieveLaunchData(): LaunchData {
  return {
    launchParams: retrieveLaunchParams(),
    isPageReload: isPageReload(),
  };
}
