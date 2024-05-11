import { setStorageValue } from '@/storage/storage.js';

import { serializeLaunchParams } from './serializeLaunchParams.js';
import type { LaunchParams } from './types.js';

/**
 * Saves specified launch parameters in the session storage.
 * @param value - launch params to save.
 */
export function saveToStorage(value: LaunchParams): void {
  setStorageValue('launchParams', serializeLaunchParams(value));
}
