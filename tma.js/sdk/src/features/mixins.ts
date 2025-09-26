import type { Version } from '@tma.js/types';
import {
  type PostEventFpFn,
  type InvokeCustomMethodError,
  type InvokeCustomMethodFpOptions,
  type RequestError,
  type CustomMethodName,
  type CustomMethodParams,
  type RequestFpFn,
  type EventName,
  off,
  on,
  postEventFp,
  isTMAFp,
  requestFp,
} from '@tma.js/bridge';
import { computed } from '@tma.js/signals';
import type * as TE from 'fp-ts/TaskEither';

import type { MaybeAccessor } from '@/types.js';
import { type ComponentStorage, createComponentSessionStorage } from '@/component-storage.js';
import { version } from '@/globals/version.js';
import { isPageReload } from '@/navigation.js';
import { access } from '@/helpers/access.js';

export interface InvokeCustomMethodNoRequestIdFn {
  <M extends CustomMethodName>(
    this: void,
    method: M,
    params: CustomMethodParams<M>,
    options?: InvokeCustomMethodFpOptions,
  ): TE.TaskEither<InvokeCustomMethodError, unknown>;

  (
    this: void,
    method: string,
    params: object,
    options?: InvokeCustomMethodFpOptions,
  ): TE.TaskEither<RequestError, unknown>;
}

export interface WithVersionedBasedPostEvent extends WithPostEvent {
  /**
   * The currently supported Telegram Mini Apps version by the Telegram client.
   */
  version: MaybeAccessor<Version>;
}

export interface WithVersion {
  /**
   * The currently supported Telegram Mini Apps version by the Telegram client.
   */
  version: MaybeAccessor<Version>;
}

export interface WithRequest {
  /**
   * A request function to use to call Mini Apps methods.
   */
  request: RequestFpFn;
}

export interface WithInvokeCustomMethod {
  invokeCustomMethod: InvokeCustomMethodNoRequestIdFn;
}

export interface WithPostEvent {
  /**
   * A postEvent function to use to call Mini Apps methods.
   */
  postEvent: PostEventFpFn;
}

export interface WithStorage<T> {
  /**
   * A storage the component could use to store its data.
   */
  storage: ComponentStorage<T>;
}

export interface WithIsPageReload {
  /**
   * True if the current page is reloaded.
   */
  isPageReload: MaybeAccessor<boolean>;
}

export interface SharedFeatureOptions {
  /**
   * True if the current environment is Telegram Mini Apps.
   */
  isTma: MaybeAccessor<boolean>;
}

export const withVersion = createMixin<WithVersion>({
  version,
});

export const withVersionedBasedPostEvent = createMixin<WithVersionedBasedPostEvent>(
  () => withPostEvent({ version }),
);

export function withClickListeners(trackedEvent: EventName) {
  return createMixin({
    onClick(listener: VoidFunction, once?: boolean): VoidFunction {
      return on(trackedEvent, listener, once);
    },
    offClick(listener: VoidFunction, once?: boolean): void {
      off(trackedEvent, listener, once);
    },
  });
}

export const withPostEvent = createMixin<WithPostEvent>({
  postEvent: postEventFp,
});

export const withRequest = createMixin<WithRequest>({
  request: requestFp,
});

export function sharedFeatureOptions(): SharedFeatureOptions {
  return {
    isTma: computed(() => isTMAFp()),
  };
}

export function withStateRestore<S>(storageName: string) {
  return createMixin<WithStorage<S> & WithIsPageReload>({
    storage: createComponentSessionStorage<S>(storageName),
    isPageReload,
  });
}

function createMixin<T>(mix: MaybeAccessor<T>) {
  return <O extends object>(obj: O) => {
    return { ...obj, ...access(mix) };
  };
}
