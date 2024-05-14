import { createPostEvent } from '@/bridge/methods/createPostEvent.js';
import { isSSR } from '@/env/isSSR.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { createSingleton } from '@/misc/createSingleton.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { createRequestIdGenerator } from '@/request-id/createRequestIdGenerator.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import type { LaunchParamName } from '@/launch-params/types.js';
import type { StorageKey, StorageValue } from '@/storage/storage.js';

import type {
  FactoryDynamic,
  FactoryOptions,
  FactoryStatic,
  InitComponentFn,
  WithOnChange,
} from './types.js';

const [createReqId] = createSingleton(createRequestIdGenerator);

/**
 * Creates new init function based only on common options.
 * @param factory - function creating new component instance.
 */
export function createComponentInitFn<R, LP extends LaunchParamName = never>(
  factory: FactoryStatic<LP, R>,
): InitComponentFn<LP, R, never>;

/**
 * Creates new init function based on common options and storage data.
 * @param factory - function creating new component instance.
 * @param storageKey - storage key to restore component from.
 */
export function createComponentInitFn<
  SK extends StorageKey,
  R extends WithOnChange<StorageValue<SK>> | Promise<WithOnChange<StorageValue<SK>>>,
  LP extends LaunchParamName = never,
>(
  storageKey: SK,
  factory: FactoryDynamic<LP, R, SK>,
): InitComponentFn<LP, R, StorageValue<SK>>;

export function createComponentInitFn<
  LP extends LaunchParamName,
  R extends WithOnChange<StorageValue<SK>> | Promise<WithOnChange<StorageValue<SK>>>,
  SK extends StorageKey,
>(
  factoryOrStorageKey: FactoryStatic<LP, R> | SK,
  factoryWithState?: FactoryDynamic<LP, R, SK>,
): InitComponentFn<LP, R, StorageValue<SK>> {
  return ({ ssr } = {}) => {
    const launchParams = isSSR()
      ? {
        version: '6.0',
        themeParams: {},
        platform: 'unknown',
        ...(ssr || {}),
      }
      : retrieveLaunchParams();

    const options = {
      ...launchParams,
      postEvent: isSSR()
        // On the server side, postEvent should do nothing.
        ? () => null
        : createPostEvent(launchParams.version),
      createRequestId: createReqId(),
    };

    // In SSR and static init modes we have no reason and to use storage to restore state. In this
    // case we just call create function.
    if (isSSR() || typeof factoryOrStorageKey === 'function') {
      return typeof factoryOrStorageKey === 'function'
        ? factoryOrStorageKey(options)
        : factoryWithState!(options);
    }

    // Otherwise, we create new component instance from the storage if possible and add
    // required change listeners.
    const result = factoryWithState!({
      ...options,
      state: isPageReload() ? getStorageValue(factoryOrStorageKey) : undefined,
    } as unknown as FactoryOptions<LP, StorageValue<SK>>);

    const bind = (value: WithOnChange<StorageValue<SK>>) => {
      value.on('change', (state) => {
        setStorageValue(factoryOrStorageKey, state);
      });
      return value;
    };

    return (
      result instanceof Promise
        ? result.then(bind)
        : bind(result)
    ) as R;
  };
}
