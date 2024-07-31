import type { ThemeParams } from '@/scopes/theme-params/types.js';
import type { State as BiometryManagerState } from '@/scopes/biometry-manager/types.js';
import type { State as MainButtonState } from '@/scopes/main-button/types.js';
import type { State as MiniAppState } from '@/scopes/mini-app/types.js';
import type { Viewport } from '@/scopes/viewport/types.js';

/**
 * Describes storage keys and corresponding values.
 */
export interface StorageParams {
  backButton: boolean;
  biometryManager: BiometryManagerState;
  closingBehavior: boolean;
  launchParams: string;
  mainButton: MainButtonState;
  miniApp: MiniAppState;
  settingsButton: boolean;
  swipeBehavior: boolean;
  themeParams: ThemeParams;
  viewport: Viewport.State;
}

/**
 * A key which could be used to store data in the storage.
 */
export type StorageKey = keyof StorageParams;

/**
 * Type specific to the specified storage key.
 */
export type StorageValue<K extends StorageKey> = StorageParams[K];

/**
 * Converts a passed storage key to the formatted state.
 * @param key - storage key.
 */
function formatKey(key: StorageKey): string {
  return `tapps/${key}`;
}

/**
 * Saves value in the storage.
 * @param key - storage key.
 * @param value - storage value.
 */
export function setStorageValue<K extends StorageKey>(key: K, value: StorageValue<K>): void {
  sessionStorage.setItem(formatKey(key), JSON.stringify(value));
}

/**
 * Extracts value from the storage.
 * @param key - storage key.
 */
export function getStorageValue<K extends StorageKey>(key: K): StorageValue<K> | undefined {
  const value = sessionStorage.getItem(formatKey(key));
  try {
    return value ? JSON.parse(value) as StorageValue<K> : undefined;
  } catch { /* empty */
  }
}
