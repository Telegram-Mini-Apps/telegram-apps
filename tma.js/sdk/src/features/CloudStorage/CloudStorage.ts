import type { Computed } from '@tma.js/signals';
import type { InvokeCustomMethodFpOptions } from '@tma.js/bridge';
import { BetterPromise } from 'better-promises';
import { array, parse, record, string } from 'valibot';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type {
  SharedComponentOptions,
  WithInvokeCustomMethod,
  WithVersion,
} from '@/features/types.js';

export interface CloudStorageOptions extends WithVersion,
  WithInvokeCustomMethod,
  SharedComponentOptions {
}

/**
 * @since Mini Apps v6.9
 */
export class CloudStorage {
  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  constructor({ version, isTma, invokeCustomMethod }: CloudStorageOptions) {
    const INVOKE_METHOD_NAME = 'web_app_invoke_custom_method';
    this.isSupported = createIsSupportedSignal(INVOKE_METHOD_NAME, version);

    const wrapOptions = { version, isSupported: INVOKE_METHOD_NAME, isTma } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const throwOnError = (error: unknown) => {
      throw error;
    };

    this.deleteItem = wrapSupported((keyOrKeys, options) => {
      return BetterPromise.fn(async () => {
        const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
        if (keys.length) {
          await pipe(
            invokeCustomMethod('deleteStorageValues', { keys }, options),
            TE.mapLeft(throwOnError),
          )();
        }
      });
    });

    this.getItem = wrapSupported(((
      keyOrKeys: string | string[],
      options?: InvokeCustomMethodFpOptions,
    ): BetterPromise<string | Record<string, string>> => {
      return BetterPromise.fn(async () => {
        const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
        if (!keys.length) {
          return Array.isArray(keyOrKeys) ? {} : '';
        }
        return pipe(
          invokeCustomMethod('getStorageValues', { keys }, options),
          TE.match(throwOnError, data => {
            const response = {
              // Fulfill the response with probably missing keys.
              ...keys.reduce<Record<string, string>>((acc, key) => {
                acc[key] = '';
                return acc;
              }, {}),
              ...parse(record(string(), string()), data),
            };

            return typeof keyOrKeys === 'string' ? response[keyOrKeys] : response;
          }),
        )();
      });
    }) as typeof this.getItem);

    this.getKeys = wrapSupported(options => {
      return BetterPromise.fn(async () => {
        return pipe(
          invokeCustomMethod('getStorageKeys', {}, options),
          TE.match(throwOnError, data => parse(array(string()), data)),
        )();
      });
    });

    this.setItem = wrapSupported((key, value, options) => {
      return BetterPromise.fn(async () => {
        await pipe(
          invokeCustomMethod('saveStorageValue', { key, value }, options),
          TE.mapLeft(throwOnError),
        )();
      });
    });

    this.clear = wrapSupported(options => {
      return this.getKeys(options)
        .then(this.deleteItem)
        .then();
    });
  }

  /**
   * Deletes specified key or keys from the cloud storage.
   * @param keyOrKeys - key or keys to delete.
   * @param options - request execution options.
   * @since Mini Apps v6.9
   */
  deleteItem: SafeWrapped<
    (keyOrKeys: string | string[], options?: InvokeCustomMethodFpOptions) => BetterPromise<void>,
    true
  >;

  /**
   * Gets multiple keys' values from the cloud storage.
   * @param keys - keys list.
   * @param options - request execution options.
   * @returns
   * - A map, where a key is one of the specified in the `keys` argument,
   * and a value is a corresponding storage value if an array of keys was passed.
   * - A key value as a string if a single key was passed.
   * @since Mini Apps v6.9
   */
  getItem: SafeWrapped<{
    <K extends string>(
      keys: K[],
      options?: InvokeCustomMethodFpOptions,
    ): BetterPromise<Record<K, string>>;
    (key: string, options?: InvokeCustomMethodFpOptions): BetterPromise<string>;
  }, true>;

  /**
   * Returns a list of all keys presented in the cloud storage.
   * @param options - request execution options.
   * @since Mini Apps v6.9
   */
  getKeys: SafeWrapped<(options?: InvokeCustomMethodFpOptions) => BetterPromise<string[]>, true>;

  /**
   * Saves the specified value by a key.
   * @param key - storage key.
   * @param value - storage value.
   * @param options - request execution options.
   * @since Mini Apps v6.9
   */
  setItem: SafeWrapped<
    (key: string, value: string, options?: InvokeCustomMethodFpOptions) => BetterPromise<void>,
    true
  >;

  /**
   * Clears the cloud storage.
   * @param options - additional options.
   * @since Mini Apps v6.9
   */
  clear: SafeWrapped<(options?: InvokeCustomMethodFpOptions) => BetterPromise<void>, true>;
}
