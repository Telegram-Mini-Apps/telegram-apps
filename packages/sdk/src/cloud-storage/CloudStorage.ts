import {
  postEvent as defaultPostEvent,
  request,
  type RequestOptions,
} from '~/bridge/index.js';
import {
  array,
  json,
  string,
} from '~/parsing/index.js';
import {
  createSupportsFunc,
  type SupportsFunc,
} from '~/supports/index.js';
import type { CreateRequestIdFunc } from '~/types/index.js';
import type { Version } from '~/version/index.js';

type WiredRequestOptions = Omit<RequestOptions, 'postEvent'>;

interface Methods {
  deleteStorageValues: { keys: string | string[] };
  getStorageValues: { keys: string | string[] };
  getStorageKeys: {};
  saveStorageValue: { key: string; value: string };
}

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
   * Invokes custom method related to CloudStorage.
   * @param method - method name.
   * @param params - method parameters.
   * @param options - execution options.
   */
  private async invokeCustomMethod<M extends keyof Methods>(
    method: M,
    params: Methods[M],
    options: WiredRequestOptions = {},
  ): Promise<unknown> {
    const { result, error } = await request(
      'web_app_invoke_custom_method',
      { method, params, req_id: this.createRequestId() },
      'custom_method_invoked',
      { ...options, postEvent: this.postEvent },
    );

    if (error) {
      throw new Error(error);
    }

    return result;
  }

  /**
   * Deletes specified key or keys from the cloud storage.
   * @param keyOrKeys - key or keys to delete.
   * @param options - request execution options.
   */
  async delete(keyOrKeys: string | string[], options?: WiredRequestOptions): Promise<void> {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    if (keys.length === 0) {
      return;
    }

    await this.invokeCustomMethod('deleteStorageValues', { keys }, options);
  }

  /**
   * Returns list of all keys presented in the cloud storage.
   * @param options - request execution options.
   */
  async getKeys(options?: WiredRequestOptions): Promise<string[]> {
    const result = await this.invokeCustomMethod('getStorageKeys', {}, options);

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
    options?: WiredRequestOptions,
  ): Promise<Record<K, string>>;

  /**
   * Returns value of the specified key.
   * @param key - cloud storage key.
   * @param options - request execution options.
   * @return Value of the specified key. In case, key was not created previously, function
   * will return empty string.
   */
  get(key: string, options?: WiredRequestOptions): Promise<string>;

  async get(
    keyOrKeys: string | string[],
    options?: WiredRequestOptions,
  ): Promise<string | Record<string, string>> {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    if (keys.length === 0) {
      return objectFromKeys<string, string>(keys, '');
    }

    const schema = json(
      objectFromKeys(keys, string()),
    );
    const result = await this
      .invokeCustomMethod('getStorageValues', { keys }, options)
      .then((data) => schema.parse(data));

    return Array.isArray(keyOrKeys) ? result : result[keyOrKeys];
  }

  /**
   * Saves specified value by key.
   * @param key - storage key.
   * @param value - storage value.
   * @param options - request execution options.
   */
  async set(key: string, value: string, options?: WiredRequestOptions): Promise<void> {
    await this.invokeCustomMethod('saveStorageValue', { key, value }, options);
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
