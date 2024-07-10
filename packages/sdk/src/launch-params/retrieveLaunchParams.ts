import { retrieveFromLocation } from './retrieveFromLocation.js';
import { retrieveFromPerformance } from './retrieveFromPerformance.js';
import { retrieveFromStorage } from './retrieveFromStorage.js';
import { saveToStorage } from './saveToStorage.js';
import type { LaunchParams } from './types.js';

/**
 * @returns Launch parameters from any known source.
 * @throws Error if extraction was unsuccessful.
 */
export function retrieveLaunchParams(): LaunchParams {
  const errors: unknown[] = [];

  for (const retrieve of [
    // Try to retrieve launch parameters from the current location. This method can return
    // nothing in case, location was changed and then page was reloaded.
    retrieveFromLocation,
    // Then, try using the lower level API - window.performance.
    retrieveFromPerformance,
    // Finally, try to extract launch parameters from the session storage.
    retrieveFromStorage,
  ]) {
    try {
      const lp = retrieve();
      saveToStorage(lp);
      return lp;
    } catch (e) {
      errors.push(e);
    }
  }

  throw new Error('Unable to retrieve launch parameters from any known source. Perhaps, you are opened your app outside of Telegram?\n\n 📖 Refer to docs for more information:\n https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/environment\n');
}
