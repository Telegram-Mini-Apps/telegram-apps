import { retrieveLaunchData } from '@tma.js/launch-params';

/**
 * Returns true in case, current environment is Telegram Mini Apps.
 */
export function isTMA(): boolean {
  try {
    retrieveLaunchData();
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Returns true in case, current environment is Telegram Mini Apps.
 * @see computeLaunchData
 * @deprecated Use `isTMA`
 */
export function isTWA(): boolean {
  return isTMA();
}
