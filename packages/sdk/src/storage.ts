import type { HeaderColorKey } from '@twa.js/bridge';
import type { RGB } from '@twa.js/colors';

/**
 * Describes storage keys and according values.
 */
interface StorageParams {
  'back-button': {
    isVisible: boolean
  };
  'main-button': {
    backgroundColor: RGB;
    isEnabled: boolean;
    isVisible: boolean;
    isProgressVisible: boolean;
    text: string;
    textColor: RGB;
  };
  viewport: {
    height: number;
    isExpanded: boolean;
    stableHeight: number;
    width: number;
  };
  'web-app': {
    backgroundColor: RGB;
    headerColor: HeaderColorKey | RGB;
  };
  'launch-params': string;
}

/**
 * Key which could be used to store data in storage.
 */
type StorageKey = keyof StorageParams;

/**
 * Formats key which could be used during the communication with the storage.
 * @param key - session storage key.
 */
function formatKey(key: StorageKey): string {
  return `telegram-web-apps-${key}`;
}

/**
 * Saves value in sessionStorage.
 * @param key - storage key.
 * @param value - storage value.
 */
export function saveStorageValue<K extends StorageKey>(key: K, value: StorageParams[K]): void {
  sessionStorage.setItem(formatKey(key), JSON.stringify(value));
}

/**
 * Extracts value from the sessionStorage.
 * @param key - storage key.
 */
export function getStorageValue<K extends StorageKey>(key: K): StorageParams[K] | null {
  const value = sessionStorage.getItem(formatKey(key));

  return value ? JSON.parse(value) : null;
}
