import { retrieveLaunchParams } from '../launch-params/retrieveLaunchParams.js';

/**
 * Returns true in case, current environment is Telegram Mini Apps.
 */
export function isTMA(): boolean {
  try {
    retrieveLaunchParams();
    return true;
  } catch (e) {
    return false;
  }
}
