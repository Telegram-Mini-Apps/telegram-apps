import { saveToStorage } from './storage.js';
import { computeLaunchData } from './computeLaunchData.js';
import type { LaunchData } from './types.js';

const WINDOW_KEY = 'tmajsLaunchData';

/**
 * Returns launch information.
 */
export function retrieveLaunchData(): LaunchData {
  // Return previously cached value.
  const cached = (window as any)[WINDOW_KEY];
  if (cached) {
    return cached;
  }

  // Get current launch data.
  const launchData = computeLaunchData();

  // To prevent the additional computation of launch data and possible break of the code
  // logic, we store this data in the window. Several calls of retrieveLaunchData will surely
  // break something.
  (window as any)[WINDOW_KEY] = launchData;

  // Save launch parameters in the session storage. We will need them during page reloads.
  saveToStorage(launchData.launchParams);

  return launchData;
}
