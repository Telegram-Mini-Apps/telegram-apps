import {
  postEvent as defaultPostEvent,
  request,
  type RequestOptions,
} from '@twa.js/bridge';
import { array, json, string } from '@twa.js/parsing';

import type { Version } from '@twa.js/utils';

import { createSupportsFunc, type SupportsFunc } from '../../supports.js';

import type { CreateRequestIdFunc } from '../../types.js';

type WiredRequestOptions = Omit<RequestOptions, 'postEvent'>;

interface Methods {
  deleteStorageValues: { keys: string | string[] };
  getStorageValues: { keys: string | string[] };
  getStorageKeys: {};
  saveStorageValue: { key: string; value: string };
}

const stringArray = array().of(string());

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
      deleteKeys: 'web_app_invoke_custom_method',
      getKeys: 'web_app_invoke_custom_method',
      getValues: 'web_app_invoke_custom_method',
      saveValue: 'web_app_invoke_custom_method',
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
      throw new Error(typeof error === 'string' ? error : `Unknown error: ${JSON.stringify(error)}`);
    }

    return result;
  }

  /**
   * Deletes specified keys from the CloudStorage.
   * @param keys - keys list.
   * @param options - request execution options.
   */
  async deleteKeys(keys: string[], options?: WiredRequestOptions): Promise<void> {
    if (keys.length === 0) {
      return;
    }

    await this.invokeCustomMethod('deleteStorageValues', { keys }, options);
  }

  /**
   * Returns list of all keys presented in CloudStorage.
   * @param options - request execution options.
   */
  async getKeys(options?: WiredRequestOptions): Promise<string[]> {
    const result = await this.invokeCustomMethod('getStorageKeys', {}, options);

    return stringArray.parse(result);
  }

  /**
   * Returns map, where key is one of the specified in keys argument, and value is according
   * storage value.
   * @param keys - keys list.
   * @param options - request execution options.
   */
  async getValues<K extends string>(
    keys: K[],
    options?: WiredRequestOptions,
  ): Promise<Record<K, string>> {
    if (keys.length === 0) {
      return objectFromKeys(keys, '');
    }

    const schema = json<Record<K, string>>(
      objectFromKeys(keys, string()) as any, // fixme
    );
    const result = await this.invokeCustomMethod('getStorageValues', { keys }, options);

    return schema.parse(result);
  }

  /**
   * Saves specified value by key.
   * @param key - storage key.
   * @param value - storage value.
   * @param options - request execution options.
   */
  async saveValue(key: string, value: string, options?: WiredRequestOptions): Promise<void> {
    await this.invokeCustomMethod('saveStorageValue', { key, value }, options);
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<
    | 'deleteKeys'
    | 'getKeys'
    | 'getValues'
    | 'saveValue'
  >;
}
