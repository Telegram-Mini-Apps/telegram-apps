import { createPostEvent } from '@/bridge/methods/createPostEvent.js';
import { isSSR } from '@/env/isSSR.js';
import { createError } from '@/errors/createError.js';
import { ERROR_SSR_INIT, ERROR_SSR_POST_EVENT } from '@/errors/errors.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { createSingleton } from '@/misc/createSingleton.js';
import { isPageReload } from '@/navigation/utils/isPageReload.js';
import { createRequestIdGenerator } from '@/request-id/createRequestIdGenerator.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import type { LaunchParamName, LaunchParams } from '@/launch-params/types.js';
import type { StorageKey, StorageValue } from '@/storage/storage.js';

import type {
  FactoryDynamic,
  FactoryOptions,
  FactoryStatic,
  InitFn, SSROptions,
  WithOnChange,
} from './types.js';

const [createReqId] = createSingleton(createRequestIdGenerator);

/**
 * Creates new init function based only on common options.
 * @param factory - function creating new component instance.
 */
export function createInitFn<R, LP extends LaunchParamName = never>(
  factory: FactoryStatic<LP, R>,
): InitFn<LP, R, never>;

/**
 * Creates new init function based on common options and storage data.
 * @param factory - function creating new component instance.
 * @param storageKey - storage key to restore component from.
 */
export function createInitFn<
  SK extends StorageKey,
  R extends WithOnChange<StorageValue<SK>> | Promise<WithOnChange<StorageValue<SK>>>,
  LP extends LaunchParamName = never,
>(
  storageKey: SK,
  factory: FactoryDynamic<LP, R, SK>,
): InitFn<LP, R, StorageValue<SK>>;

export function createInitFn<
  LP extends LaunchParamName,
  R extends WithOnChange<StorageValue<SK>> | Promise<WithOnChange<StorageValue<SK>>>,
  SK extends StorageKey,
>(
  factoryOrStorageKey: FactoryStatic<LP, R> | SK,
  factoryWithState?: FactoryDynamic<LP, R, SK>,
): InitFn<LP, R, StorageValue<SK>> {
  return ({ ssr } = {}) => {
    let deps: SSROptions<LP, StorageValue<SK>> | LaunchParams;

    if (isSSR()) {
      if (!ssr) {
        throw createError(
          ERROR_SSR_INIT,
          'ssr.options must be specified to initialize component on the server side',
        );
      }
      deps = ssr;
    } else {
      deps = retrieveLaunchParams();
    }

    const options = {
      ...deps,
      postEvent: 'version' in deps
        ? createPostEvent(deps.version)
        // We will not get Mini Apps version only in case, current env is SSR. So, we don't really
        // care what postEvent will be, but notify user in case, he used it.
        : () => {
          throw createError(
            ERROR_SSR_POST_EVENT,
            'postEvent function is forbidden to be called on the server side.',
          );
        },
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
