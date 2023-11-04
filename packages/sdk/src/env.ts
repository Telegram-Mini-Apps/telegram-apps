import { retrieveLaunchParams } from './launch-params.js';

/**
 * Returns true in case, current environment is Telegram Mini Apps.
 *
 * `isTWA` utilizes such function as `retrieveLaunchParams`, which attempts to retrieve
 * launch parameters from the current environment.
 * @see retrieveLaunchParams
 */
export function isTWA(): boolean {
  try {
    retrieveLaunchParams();
    return true;
  } catch (e) {
    return false;
  }
}
