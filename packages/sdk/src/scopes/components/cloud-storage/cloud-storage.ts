import { CancelablePromise, type ExecuteWithOptions, supports } from '@telegram-apps/bridge';
import { array, object, string } from '@telegram-apps/transformers';

import { $version, invokeCustomMethod } from '@/scopes/globals.js';

const MINI_APPS_METHOD = 'web_app_invoke_custom_method';

/**
 * Deletes specified key or keys from the cloud storage.
 * @param keyOrKeys - key or keys to delete.
 * @param options - request execution options.
 */
export function deleteItem(
  keyOrKeys: string | string[],
  options?: ExecuteWithOptions,
): CancelablePromise<void> {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
  return keys.length
    ? invokeCustomMethod('deleteStorageValues', { keys }, options).then()
    : CancelablePromise.resolve();
}

/**
 * @param keys - keys list.
 * @param options - request execution options.
 * @returns Map, where a key is one of the specified in the `keys` argument, and a value is
 * a corresponding storage value.
 */
export function getItem<K extends string>(
  keys: K[],
  options?: ExecuteWithOptions,
): CancelablePromise<Record<K, string>>;

/**
 * @param key - cloud storage key.
 * @param options - request execution options.
 * @return Value of the specified key. If the key was not created previously, the function
 * will return an empty string.
 */
export function getItem(key: string, options?: ExecuteWithOptions): CancelablePromise<string>;

export function getItem(
  keyOrKeys: string | string[],
  options?: ExecuteWithOptions,
): CancelablePromise<string | Record<string, string>> {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

  return keys.length
    ? invokeCustomMethod('getStorageValues', { keys }, options).then(data => {
      const result = object(
        Object.fromEntries(keys.map((k) => [k, string()])),
      )()(data);

      return Array.isArray(keyOrKeys) ? result : result[keyOrKeys];
    })
    : CancelablePromise.resolve(typeof keyOrKeys === 'string' ? '' : {});
}

/**
 * Returns a list of all keys presented in the cloud storage.
 * @param options - request execution options.
 */
export function getKeys(options?: ExecuteWithOptions): CancelablePromise<string[]> {
  return invokeCustomMethod('getStorageKeys', {}, options).then(array(string())());
}

/**
 * @returns True if the cloud storage is supported.
 */
export function isSupported(): boolean {
  return supports(MINI_APPS_METHOD, $version());
}

/**
 * Saves specified value by key.
 * @param key - storage key.
 * @param value - storage value.
 * @param options - request execution options.
 */
export function setItem(
  key: string,
  value: string,
  options?: ExecuteWithOptions,
): CancelablePromise<void> {
  return invokeCustomMethod('saveStorageValue', { key, value }, options).then();
}
