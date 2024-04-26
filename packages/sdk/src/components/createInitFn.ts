import { postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { isPageReload as isPageReloadFn } from '@/navigation/utils/isPageReload.js';
import { createRequestIdGenerator } from '@/request-id/createRequestIdGenerator.js';
import {
  getStorageValue,
  setStorageValue,
  type StorageKey,
  type StorageValue,
} from '@/storage/storage.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { CreateRequestIdFn } from '@/request-id/types.js';
import type { Version } from '@/version/types.js';

interface Trackable<State> {
  on(event: 'change', listener: (state: State) => void): void;
}

interface CreateOptions {
  version: Version;
  postEvent: PostEvent;
  createRequestId: CreateRequestIdFn;
}

export interface InitFnSimpleOptions extends Partial<CreateOptions> {
}

export interface InitFnStorageOptions extends InitFnSimpleOptions {
  isPageReload?: boolean;
}

interface CreateFnBasic<Component> {
  (options: CreateOptions): Component;
}

interface CreateFnStorage<Component, SK extends StorageKey> {
  (options: CreateOptions, state: Partial<StorageValue<SK>>): Component,
}

export interface InitFn<Options, Component> {
  (options?: Options): Component;
}

/**
 * Creates new init function based only on common options.
 * @param create - function creating new component instance.
 */
export function createInitFn<Component>(
  create: CreateFnBasic<Component>,
): InitFn<InitFnSimpleOptions, Component>;

/**
 * Creates new init function based on common options and storage data.
 * @param create - function creating new component instance.
 * @param storageKey - storage key to restore component from.
 */
export function createInitFn<Component extends Trackable<StorageValue<SK>>, SK extends StorageKey>(
  storageKey: SK,
  create: CreateFnStorage<Component, SK>,
): InitFn<InitFnStorageOptions, Component>;

export function createInitFn<Component>(
  createOrStorageKey: CreateFnBasic<Component> | StorageKey,
  create?: CreateFnStorage<Component, StorageKey>,
):
  | InitFn<InitFnSimpleOptions, Component>
  | InitFn<InitFnStorageOptions, Component> {
  return ((options: InitFnSimpleOptions | InitFnStorageOptions): Component => {
    const {
      postEvent = defaultPostEvent,
      version = retrieveLaunchParams().version,
      createRequestId = createRequestIdGenerator(),
    } = options;
    const commonOptions = { postEvent, version, createRequestId };

    if (typeof createOrStorageKey === 'function') {
      return createOrStorageKey(commonOptions);
    }

    const {
      isPageReload = isPageReloadFn(),
    } = options as InitFnStorageOptions;
    const component = (create as CreateFnStorage<Component, StorageKey>)(
      commonOptions,
      (isPageReload ? getStorageValue(createOrStorageKey as StorageKey) : null) || {},
    );

    (component as Trackable<StorageValue<StorageKey>>).on(
      'change',
      (state) => setStorageValue(createOrStorageKey, state),
    );

    return component;
  }) as
    | InitFn<InitFnSimpleOptions, Component>
    | InitFn<InitFnStorageOptions, Component>;
}