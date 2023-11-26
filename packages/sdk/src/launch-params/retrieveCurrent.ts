import { retrieveFromLocation } from './retrieveFromLocation.js';
import { retrieveFromPerformance } from './retrieveFromPerformance.js';
import type { LaunchParams } from './types.js';

/**
 * Attempts to retrieve launch parameters using every known way.
 */
export function retrieveCurrent(): LaunchParams | null {
  // First of all, attempt to retrieve launch parameters from the window.performance as long as
  // this way is considered the most stable. Nevertheless, this method can return nothing in case,
  // location was changed and then page was reloaded.
  try {
    return retrieveFromPerformance();
    // eslint-disable-next-line no-empty
  } catch (e) {
  }

  // In case, usage of window.performance was unsuccessful, try to retrieve launch parameters
  // from the window.location.
  try {
    return retrieveFromLocation();
    // eslint-disable-next-line no-empty
  } catch (e) {
  }

  return null;
}
