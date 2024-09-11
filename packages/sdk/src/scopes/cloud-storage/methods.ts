import { invokeCustomMethod } from '@telegram-apps/bridge';
import { array, object, string } from '@telegram-apps/transformers';
import { type AsyncOptions, CancelablePromise } from '@telegram-apps/toolkit';

import {
  withIsSupported,
  type WithIsSupported,
} from '@/scopes/withIsSupported.js';
import { $createRequestId, $postEvent } from '@/scopes/globals/globals.js';

const MINI_APPS_METHOD = 'web_app_invoke_custom_method';

/**
 * Deletes specified key or keys from the cloud storage.
 * @param keyOrKeys - key or keys to delete.
 * @param options - request execution options.
 */
export const deleteKeys: WithIsSupported<(
  keyOrKeys: string | string[],
  options?: AsyncOptions,
) => CancelablePromise<void>> =
  withIsSupported((keyOrKeys, options) => {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

    return keys.length
      ? invokeCustomMethod(
        'deleteStorageValues',
        { keys },
        $createRequestId()(),
        { ...options || {}, postEvent: $postEvent() },
      )
        .then(() => {
        })
      : CancelablePromise.resolve();
  }, MINI_APPS_METHOD);

/**
 * Returns list of all keys presented in the cloud storage.
 * @param options - request execution options.
 */
export const getKeys: WithIsSupported<(options?: AsyncOptions) => CancelablePromise<string[]>> =
  withIsSupported(options => {
    return invokeCustomMethod(
      'getStorageKeys',
      {},
      $createRequestId()(),
      { ...options || {}, postEvent: $postEvent() },
    )
      .then(array(string())());
  }, MINI_APPS_METHOD);

type GetFn = WithIsSupported<{
  /**
   * @param keys - keys list.
   * @param options - request execution options.
   * @returns Map, where a key is one of the specified in the `keys` argument, and a value is
   * a corresponding storage value.
   */<K extends string>(keys: K[], options?: AsyncOptions): CancelablePromise<Record<K, string>>;
  /**
   * @param key - cloud storage key.
   * @param options - request execution options.
   * @return Value of the specified key. If the key was not created previously, the function
   * will return an empty string.
   */
  (key: string, options?: AsyncOptions): CancelablePromise<string>;
}>;

export const get: GetFn = withIsSupported(
  (
    keyOrKeys: string | string[],
    options?: AsyncOptions,
  ): CancelablePromise<string | Record<string, string>> => {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    if (!keys.length) {
      return CancelablePromise.resolve(typeof keyOrKeys === 'string' ? '' : {});
    }

    return invokeCustomMethod(
      'getStorageValues',
      { keys },
      $createRequestId()(),
      { ...options || {}, postEvent: $postEvent() },
    )
      .then(data => {
        const result = object(
          Object.fromEntries(keys.map((k) => [k, string()])),
        )()(data);

        return Array.isArray(keyOrKeys) ? result : result[keyOrKeys];
      });
  },
  MINI_APPS_METHOD,
) as GetFn;

/**
 * Saves specified value by key.
 * @param key - storage key.
 * @param value - storage value.
 * @param options - request execution options.
 */
export const set: WithIsSupported<(
  key: string,
  value: string,
  options?: AsyncOptions,
) => CancelablePromise<void>> = withIsSupported(
  (key, value, options) => {
    return invokeCustomMethod(
      'saveStorageValue',
      { key, value },
      $createRequestId()(),
      { ...options || {}, postEvent: $postEvent() },
    ) as CancelablePromise<void>;
  },
  MINI_APPS_METHOD,
);
