import { invokeCustomMethod } from '@/bridge/invokeCustomMethod.js';
import { array } from '@/parsing/parsers/array.js';
import { json } from '@/parsing/parsers/json.js';
import { string } from '@/parsing/parsers/string.js';
import {
  decorateWithSupports,
  type WithSupports,
} from '@/components/decorateWithSupports.js';
import { createRequestId, postEvent } from '@/globals/globals.js';
import type { ExecuteWithTimeout } from '@/types/methods.js';

const MINI_APPS_METHOD = 'web_app_invoke_custom_method';

/*
 * fixme
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/cloud-storage
 * todo: usage
 */

/**
 * Deletes specified key or keys from the cloud storage.
 * @param keyOrKeys - key or keys to delete.
 * @param options - request execution options.
 */
export const deleteKeys = decorateWithSupports(
  async (keyOrKeys: string | string[], options: ExecuteWithTimeout = {}): Promise<void> => {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    if (keys.length) {
      await invokeCustomMethod(
        'deleteStorageValues',
        { keys },
        createRequestId()(),
        { ...options, postEvent: postEvent() },
      );
    }
  },
  MINI_APPS_METHOD,
);

/**
 * Returns list of all keys presented in the cloud storage.
 * @param options - request execution options.
 */
export const getKeys = decorateWithSupports(
  async (options: ExecuteWithTimeout = {}): Promise<string[]> => {
    return array().of(string()).parse(
      await invokeCustomMethod(
        'getStorageKeys',
        {},
        createRequestId()(),
        { ...options, postEvent: postEvent() },
      ),
    );
  },
  MINI_APPS_METHOD,
);

export type GetFn = WithSupports<{
  /**
   * @param keys - keys list.
   * @param options - request execution options.
   * @returns Map, where a key is one of the specified in the `keys` argument, and a value is
   * a corresponding storage value.
   */<K extends string>(keys: K[], options?: ExecuteWithTimeout): Promise<Record<K, string>>;
  /**
   * @param key - cloud storage key.
   * @param options - request execution options.
   * @return Value of the specified key. If the key was not created previously, the function
   * will return an empty string.
   */
  (key: string, options?: ExecuteWithTimeout): Promise<string>;
}>;

export const get: GetFn = decorateWithSupports(
  async (
    keyOrKeys: string | string[],
    options?: ExecuteWithTimeout,
  ): Promise<string | Record<string, string>> => {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    if (!keys.length) {
      return typeof keyOrKeys === 'string' ? '' : {};
    }

    const data = await invokeCustomMethod(
      'getStorageValues',
      { keys },
      createRequestId()(),
      { ...options || {}, postEvent: postEvent() },
    );

    const result = json(
      Object.fromEntries(keys.map((k) => [k, string()])),
      'CloudStorageData',
    ).parse(data);

    return Array.isArray(keyOrKeys) ? result : result[keyOrKeys];
  },
  MINI_APPS_METHOD,
) as GetFn;

/**
 * Saves specified value by key.
 * @param key - storage key.
 * @param value - storage value.
 * @param options - request execution options.
 */
export const set = decorateWithSupports(
  async (key: string, value: string, options: ExecuteWithTimeout = {}): Promise<void> => {
    await invokeCustomMethod(
      'saveStorageValue',
      { key, value },
      createRequestId()(),
      { ...options, postEvent: postEvent() },
    );
  },
  MINI_APPS_METHOD,
);
