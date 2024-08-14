import type { LaunchParams } from '@telegram-apps/bridge';

import { setStorageValue } from '@/utils/storage.js';

import { serializeLaunchParams } from './serializeLaunchParams.js';

/**
 * Saves specified launch parameters in the session storage.
 * @param value - launch params to save.
 */
export function saveToStorage(value: LaunchParams): void {
  setStorageValue('launchParams', serializeLaunchParams(value));
}
