import { AbortablePromise } from 'better-promises';
import { array, check, parse, pipe, record, string } from 'valibot';

import { invokeCustomMethod } from '@/globals.js';
import { createIsSupported } from '@/scopes/createIsSupported.js';
import { createWrapSupported } from '@/scopes/wrappers/createWrapSupported.js';
import type { InvokeCustomMethodOptions } from '@telegram-apps/bridge';

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
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
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
  options?: InvokeCustomMethodOptions,
): AbortablePromise<void> => {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
  return keys.length
    ? invokeCustomMethod('deleteStorageValues', { keys }, options).then()
    : AbortablePromise.resolve();
});

/**
 * Gets multiple keys' values from the cloud storage.
 * @param keys - keys list.
 * @param options - request execution options.
 * @returns Map, where a key is one of the specified in the `keys` argument,
 * and a value is a corresponding storage value.
 * @since Mini Apps v6.9
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (deleteItem.isAvailable()) {
 *   const { key1, key2 } = await getItem(['key1', 'key2']);
 * }
 */
function _getItem<K extends string>(
  keys: K[],
  options?: InvokeCustomMethodOptions,
): AbortablePromise<Record<K, string>>;

/**
 * Gets a single key value from the cloud storage.
 * @param key - cloud storage key.
 * @param options - request execution options.
 * @return Value of the specified key. If the key was not created previously,
 * the function will return an empty string.
 * @since Mini Apps v6.9
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (getItem.isAvailable()) {
 *   const keyValue = await getItem('my-key');
 * }
 */
function _getItem(key: string, options?: InvokeCustomMethodOptions): AbortablePromise<string>;

function _getItem(
  keyOrKeys: string | string[],
  options?: InvokeCustomMethodOptions,
): AbortablePromise<string | Record<string, string>> {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

  return keys.length
    ? invokeCustomMethod('getStorageValues', { keys }, options).then(data => {
      return parse(
        record(
          pipe(string(), check(v => keys.includes(v))),
          string(),
        ),
        data,
      );
    })
    : AbortablePromise.resolve(typeof keyOrKeys === 'string' ? '' : {});
}

export const getItem = wrapSupported('getItem', _getItem);

/**
 * Returns a list of all keys presented in the cloud storage.
 * @param options - request execution options.
 * @since Mini Apps v6.9
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (getKeys.isAvailable()) {
 *   const keysArray = await getKeys();
 * }
 */
export const getKeys = wrapSupported('getKeys', (
  options?: InvokeCustomMethodOptions,
): AbortablePromise<string[]> => {
  return invokeCustomMethod('getStorageKeys', {}, options).then(
    data => parse(array(string()), data),
  );
});

/**
 * Saves the specified value by a key.
 * @param key - storage key.
 * @param value - storage value.
 * @param options - request execution options.
 * @since Mini Apps v6.9
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (setItem.isAvailable()) {
 *   await setItem('key', 'value');
 * }
 */
export const setItem = wrapSupported('setItem', (
  key: string,
  value: string,
  options?: InvokeCustomMethodOptions,
): AbortablePromise<void> => {
  return invokeCustomMethod('saveStorageValue', {
    key,
    value,
  }, options).then();
});

/**
 * Clears the cloud storage.
 * @param options - additional options.
 * @since Mini Apps v6.9
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (clear.isAvailable()) {
 *   await clear();
 * }
 */
export const clear = wrapSupported('clear', (
  options?: InvokeCustomMethodOptions,
) => getKeys(options).then(deleteItem));