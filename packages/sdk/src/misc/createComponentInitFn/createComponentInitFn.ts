import { createPostEvent } from '@/bridge/methods/createPostEvent.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { createSingleton } from '@/misc/createSingleton.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { createRequestIdGenerator } from '@/request-id/createRequestIdGenerator.js';
import type { StorageKey, StorageValue } from '@/storage/storage.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { createCleanup } from '@/misc/createCleanup.js';

import {
  FactoryDynamic,
  FactoryStatic,
  InitStaticComponentFn,
  InitDynamicComponentFn,
  WithOnChange,
} from './types.js';

const [createReqId] = createSingleton(createRequestIdGenerator);

/**
 * Creates a new init function based on factory, creating a component, not synchronizing its
 * state with the session storage.
 * @param factory - function creating new component instance.
 */
export function createComponentInitFn<R>(factory: FactoryStatic<R>): InitStaticComponentFn<R>;

/**
 * Creates a new init function based on factory, creating a component, synchronizing its
 * state with the session storage.
 * @param factory - function creating new component instance.
 * @param storageKey - storage key to restore component from.
 */
export function createComponentInitFn<
  SK extends StorageKey,
  R extends WithOnChange<StorageValue<SK>> | Promise<WithOnChange<StorageValue<SK>>>,
>(
  storageKey: SK,
  factory: FactoryDynamic<R, SK>,
): InitDynamicComponentFn<R>;

export function createComponentInitFn<
  R extends WithOnChange<StorageValue<SK>> | Promise<WithOnChange<StorageValue<SK>>>,
  SK extends StorageKey,
>(
  factoryStaticOrSK: FactoryStatic<R> | SK,
  factoryDynamic?: FactoryDynamic<R, SK>,
): InitStaticComponentFn<R> | InitDynamicComponentFn<R> {
  return () => {
    const lp = retrieveLaunchParams();
    const factoryOptions = {
      ...lp,
      postEvent: createPostEvent(lp.version),
      createRequestId: createReqId(),
    };

    // In static init mode we have no reason to use the storage to restore the state. In this
    // case we should just call the factory.
    if (typeof factoryStaticOrSK === 'function') {
      return factoryStaticOrSK(factoryOptions);
    }

    // Otherwise, we create a new component instance from the storage if possible and add
    // required change listeners.
    const [addCleanup, cleanup, cleanedUp] = createCleanup();

    const result = factoryDynamic!({
      ...factoryOptions,
      // State should only be passed only in case, current page was reloaded. If we don't add
      // this check, state restoration will work improperly in the web version of Telegram,
      // when we are always working in the same "session" (tab).
      state: isPageReload() ? getStorageValue(factoryStaticOrSK) : undefined,
      addCleanup,
    });

    const bindChange = (value: WithOnChange<StorageValue<SK>>) => {
      if (!cleanedUp) {
        addCleanup(
          value.on('change', (state) => {
            setStorageValue(factoryStaticOrSK, state);
          }),
        );
      }
      return value;
    };

    return [
      result instanceof Promise ? result.then(bindChange) : bindChange(result),
      cleanup,
    ] as unknown as R;
  };
}
