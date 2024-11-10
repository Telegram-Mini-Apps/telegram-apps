import {
  CancelablePromise,
  type ExecuteWithOptions,
} from '@telegram-apps/bridge';
import { array, object, string } from '@telegram-apps/transformers';

import { invokeCustomMethod } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';

const INVOKE_METHOD_NAME = 'web_app_invoke_custom_method';
const wrapSupported = createWrapSupported('cloudStorage', INVOKE_METHOD_NAME);

/**
 * Signal indicating if the Cloud Storage is supported.
 */
export const isSupported = createIsSupported(INVOKE_METHOD_NAME);

/**
 * Deletes specified key or keys from the cloud storage.
 * @param keyOrKeys - key or keys to delete.
 * @param options - request execution options.
 * @since Mini Apps v6.9
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example Deleting a single key
 * if (deleteItem.isAvailable()) {
 *   await deleteItem('my-key');
 * }
 * @example Deleting multiple keys
 * if (deleteItem.isAvailable()) {
 *   await deleteItem(['key1', 'key2']);
 * }
 */
export const deleteItem = wrapSupported('deleteItem', (
  keyOrKeys: string | string[],
  options?: ExecuteWithOptions,
): CancelablePromise<void> => {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
  return keys.length
    ? invokeCustomMethod('deleteStorageValues', { keys }, options).then()
    : CancelablePromise.resolve();
});

/**
 * Gets multiple keys' values from the cloud storage.
 * @param keys - keys list.
 * @param options - request execution options.
 * @returns Map, where a key is one of the specified in the `keys` argument,
 * and a value is a corresponding storage value.
 * @since Mini Apps v6.9
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
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
 * Gets a single key value from the cloud storage.
 * @param key - cloud storage key.
 * @param options - request execution options.
 * @return Value of the specified key. If the key was not created previously,
 * the function will return an empty string.
 * @since Mini Apps v6.9
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
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
 * @since Mini Apps v6.9
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (getKeys.isAvailable()) {
 *   const keysArray = await getKeys();
 * }
 */
export const getKeys = wrapSupported('getKeys', (
  options?: ExecuteWithOptions,
): CancelablePromise<string[]> => {
  return invokeCustomMethod('getStorageKeys', {}, options)
    .then(array(string())());
});

/**
 * Saves the specified value by a key.
 * @param key - storage key.
 * @param value - storage value.
 * @param options - request execution options.
 * @since Mini Apps v6.9
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (setItem.isAvailable()) {
 *   await setItem('key', 'value');
 * }
 */
export const setItem = wrapSupported('setItem', (
  key: string,
  value: string,
  options?: ExecuteWithOptions,
): CancelablePromise<void> => {
  return invokeCustomMethod('saveStorageValue', {
    key,
    value,
  }, options).then();
});
