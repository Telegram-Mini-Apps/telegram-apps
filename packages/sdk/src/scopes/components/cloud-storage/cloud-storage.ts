import { CancelablePromise, type ExecuteWithOptions } from '@telegram-apps/bridge';
import { array, object, string } from '@telegram-apps/transformers';

import { invokeCustomMethod } from '@/scopes/globals.js';
import { createWithIsSupported } from '@/scopes/toolkit/createWithIsSupported.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';

const WEB_APP_INVOKE_CUSTOM_METHOD = 'web_app_invoke_custom_method';

/**
 * @returns True if the Cloud Storage is supported.
 */
export const isSupported = createIsSupported(WEB_APP_INVOKE_CUSTOM_METHOD);

const withIsSupported = createWithIsSupported(isSupported);

/**
 * Deletes specified key or keys from the cloud storage.
 * @param keyOrKeys - key or keys to delete.
 * @param options - request execution options.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const deleteItem = withIsSupported((
  keyOrKeys: string | string[],
  options?: ExecuteWithOptions,
): CancelablePromise<void> => {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
  return keys.length
    ? invokeCustomMethod('deleteStorageValues', { keys }, options).then()
    : CancelablePromise.resolve();
});

/**
 * @param keys - keys list.
 * @param options - request execution options.
 * @returns Map, where a key is one of the specified in the `keys` argument, and a value is
 * a corresponding storage value.
 */
function _getItem<K extends string>(
  keys: K[],
  options?: ExecuteWithOptions,
): CancelablePromise<Record<K, string>>;

/**
 * @param key - cloud storage key.
 * @param options - request execution options.
 * @return Value of the specified key. If the key was not created previously, the function
 * will return an empty string.
 */
function _getItem(key: string, options?: ExecuteWithOptions): CancelablePromise<string>;

function _getItem(
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
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const getItem = withIsSupported(_getItem);

/**
 * Returns a list of all keys presented in the cloud storage.
 * @param options - request execution options.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const getKeys = withIsSupported(
  (options?: ExecuteWithOptions): CancelablePromise<string[]> => {
    return invokeCustomMethod('getStorageKeys', {}, options).then(array(string())());
  },
);

/**
 * Saves specified value by key.
 * @param key - storage key.
 * @param value - storage value.
 * @param options - request execution options.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const setItem = withIsSupported(
  (key: string, value: string, options?: ExecuteWithOptions): CancelablePromise<void> => {
    return invokeCustomMethod('saveStorageValue', {
      key,
      value,
    }, options).then();
  },
);
