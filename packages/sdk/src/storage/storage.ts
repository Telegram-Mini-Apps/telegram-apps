import type { BackButtonState } from '@/components/back-button/types.js';
import type { BiometryManagerState } from '@/components/biometry-manager/types.js';
import type { ClosingBehaviorState } from '@/components/closing-behavior/types.js';
import type { MainButtonState } from '@/components/main-button/types.js';
import type { MiniAppState } from '@/components/mini-app/types.js';
import type { SettingsButtonState } from '@/components/settings-button/types.js';
import type { ThemeParamsParsed } from '@/components/theme-params/types.js';
import type { ViewportState } from '@/components/viewport/types.js';

/**
 * Describes storage keys and according values.
 */
export interface StorageParams {
  backButton: BackButtonState;
  biometryManager: BiometryManagerState;
  closingBehavior: ClosingBehaviorState;
  launchParams: string;
  mainButton: MainButtonState;
  miniApp: MiniAppState;
  settingsButton: SettingsButtonState;
  themeParams: ThemeParamsParsed;
  viewport: ViewportState;
}

/**
 * Key which could be used to store data in the storage.
 */
export type StorageKey = keyof StorageParams;

/**
 * Type specific to the specified storage key.
 */
export type StorageValue<K extends StorageKey> = StorageParams[K];

/**
 * Converts passed storage key to the formatted state.
 * @param key - storage key.
 */
function formatKey(key: StorageKey): string {
  return `@tma.js/${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
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
  return value ? JSON.parse(value) : undefined;
}
