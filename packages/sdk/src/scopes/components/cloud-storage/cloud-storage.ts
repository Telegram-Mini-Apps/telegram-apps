import {
  CancelablePromise,
  type ExecuteWithOptions,
} from '@telegram-apps/bridge';
import { array, object, string } from '@telegram-apps/transformers';

import { invokeCustomMethod } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import {
  createWrapSafeSupported
} from '@/scopes/toolkit/createWrapSafeSupported.js';

const WEB_APP_INVOKE_CUSTOM_METHOD = 'web_app_invoke_custom_method';
const wrapSupported = createWrapSafeSupported('cloudStorage', WEB_APP_INVOKE_CUSTOM_METHOD);

/**
 * @returns True if the Cloud Storage component is supported.
 */
export const isSupported = createIsSupported(WEB_APP_INVOKE_CUSTOM_METHOD);

/**
 * Deletes specified key or keys from the cloud storage.
 * @param keyOrKeys - key or keys to delete.
 * @param options - request execution options.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example Single key.
 * if (deleteItem.isAvailable()) {
 *   await deleteItem('my-key');
 * }
 * @example Multiple keys.
 * if (deleteItem.isAvailable()) {
 *   await deleteItem(['key1', 'key2']);
 * }
 */
export const deleteItem = wrapSupported(
  'deleteItem',
  (
    keyOrKeys: string | string[],
    options?: ExecuteWithOptions,
  ): CancelablePromise<void> => {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    return keys.length
      ? invokeCustomMethod('deleteStorageValues', { keys }, options).then()
      : CancelablePromise.resolve();
  },
);

/**
 * @param keys - keys list.
 * @param options - request execution options.
 * @returns Map, where a key is one of the specified in the `keys` argument, and a value is
 * a corresponding storage value.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (deleteItem.isAvailable()) {
 *   const { key1, key2 } = await getItem(['key1', 'key2']);
 * }
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
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (getItem.isAvailable()) {
 *   const keyValue = await getItem('my-key');
 * }
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

export const getItem = wrapSupported('getItem', _getItem);

/**
 * Returns a list of all keys presented in the cloud storage.
 * @param options - request execution options.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (getKeys.isAvailable()) {
 *   const keysArray = await getKeys();
 * }
 */
export const getKeys = wrapSupported(
  'getKeys',
  (options?: ExecuteWithOptions): CancelablePromise<string[]> => {
    return invokeCustomMethod('getStorageKeys', {}, options).then(array(string())());
  },
);

/**
 * Saves specified value by key.
 * @param key - storage key.
 * @param value - storage value.
 * @param options - request execution options.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (setItem.isAvailable()) {
 *   await setItem('key', 'value');
 * }
 */
export const setItem = wrapSupported(
  'setItem',
  (key: string, value: string, options?: ExecuteWithOptions): CancelablePromise<void> => {
    return invokeCustomMethod('saveStorageValue', {
      key,
      value,
    }, options).then();
  },
);
