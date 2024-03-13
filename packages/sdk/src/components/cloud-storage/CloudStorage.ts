import { invokeCustomMethod } from '../../bridge/invokeCustomMethod.js';
import { postEvent as defaultPostEvent } from '../../bridge/methods/postEvent.js';
import { array } from '../../parsing/parsers/array.js';
import { json } from '../../parsing/parsers/json.js';
import { string } from '../../parsing/parsers/string.js';
import { createSupportsFunc } from '../../supports/createSupportsFunc.js';
import type { SupportsFunc } from '../../supports/types.js';
import type { ExecuteWithTimeout } from '../../types/methods.js';
import type { CreateRequestIdFunc } from '../../types/request-id.js';
import type { Version } from '../../version/types.js';

function objectFromKeys<K extends string, V>(keys: K[], value: V): Record<K, V> {
  return keys.reduce<Record<K, V>>((acc, key) => {
    acc[key] = value;
    return acc;
  }, {} as Record<K, V>);
}

export class CloudStorage {
  constructor(
    version: Version,
    private readonly createRequestId: CreateRequestIdFunc,
    private readonly postEvent = defaultPostEvent,
  ) {
    this.supports = createSupportsFunc(version, {
      delete: 'web_app_invoke_custom_method',
      get: 'web_app_invoke_custom_method',
      getKeys: 'web_app_invoke_custom_method',
      set: 'web_app_invoke_custom_method',
    });
  }

  /**
   * Deletes specified key or keys from the cloud storage.
   * @param keyOrKeys - key or keys to delete.
   * @param options - request execution options.
   */
  async delete(keyOrKeys: string | string[], options: ExecuteWithTimeout = {}): Promise<void> {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    if (keys.length === 0) {
      return;
    }

    await invokeCustomMethod(
      'deleteStorageValues',
      { keys },
      this.createRequestId(),
      { ...options, postEvent: this.postEvent },
    );
  }

  /**
   * Returns list of all keys presented in the cloud storage.
   * @param options - request execution options.
   */
  async getKeys(options: ExecuteWithTimeout = {}): Promise<string[]> {
    const result = await invokeCustomMethod(
      'getStorageKeys',
      {},
      this.createRequestId(),
      { ...options, postEvent: this.postEvent },
    );

    return array().of(string()).parse(result);
  }

  /**
   * Returns map, where key is one of the specified in keys argument, and value is according
   * storage value.
   * @param keys - keys list.
   * @param options - request execution options.
   */
  get<K extends string>(
    keys: K[],
    options?: ExecuteWithTimeout,
  ): Promise<Record<K, string>>;

  /**
   * Returns value of the specified key.
   * @param key - cloud storage key.
   * @param options - request execution options.
   * @return Value of the specified key. In case, key was not created previously, function
   * will return empty string.
   */
  get(key: string, options?: ExecuteWithTimeout): Promise<string>;

  async get(
    keyOrKeys: string | string[],
    options: ExecuteWithTimeout = {},
  ): Promise<string | Record<string, string>> {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    if (keys.length === 0) {
      return objectFromKeys<string, string>(keys, '');
    }

    const schema = json(
      objectFromKeys(keys, string()),
    );
    const result = await invokeCustomMethod(
      'getStorageValues',
      { keys },
      this.createRequestId(),
      { ...options, postEvent: this.postEvent },
    ).then((data) => schema.parse(data));

    return Array.isArray(keyOrKeys) ? result : result[keyOrKeys];
  }

  /**
   * Saves specified value by key.
   * @param key - storage key.
   * @param value - storage value.
   * @param options - request execution options.
   */
  async set(key: string, value: string, options: ExecuteWithTimeout = {}): Promise<void> {
    await invokeCustomMethod(
      'saveStorageValue',
      { key, value },
      this.createRequestId(),
      { ...options, postEvent: this.postEvent },
    );
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<
    | 'delete'
    | 'get'
    | 'getKeys'
    | 'set'
  >;
}
