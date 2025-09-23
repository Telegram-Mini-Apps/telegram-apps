import type { Version } from '@tma.js/types';
import type {
  PostEventFpFn,
  InvokeCustomMethodError,
  InvokeCustomMethodFpOptions,
  RequestError,
  CustomMethodName,
  CustomMethodParams,
  RequestFpFn,
} from '@tma.js/bridge';
import type * as TE from 'fp-ts/TaskEither';

import type { MaybeAccessor } from '@/types.js';
import type { ComponentStorage } from '@/component-storage.js';

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

export interface WithStorage<T extends ComponentStorage<any>> {
  /**
   * A storage the component could use to store its data.
   */
  storage: T;
}

export interface WithOnClickListener {
  /**
   * Adds a component click listener.
   * @returns A function to remove listener.
   * @param listener - a listener to add.
   * @param once - should the listener be called only once.
   */
  onClick: (listener: VoidFunction, once?: boolean) => VoidFunction;
  /**
   * Removes a component click listener.
   * @param listener - a listener to remove.
   * @param once - should the listener be called only once.
   */
  offClick: (listener: VoidFunction, once?: boolean) => void;
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
