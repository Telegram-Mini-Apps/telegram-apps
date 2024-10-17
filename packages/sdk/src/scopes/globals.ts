import {
  retrieveLaunchParams,
  postEvent as _postEvent,
  request as _request,
  invokeCustomMethod as _invokeCustomMethod,
  createPostEvent,
  type PostEventFn,
  type Version,
  type RequestFn,
  type CancelablePromise,
  type ExecuteWithOptions,
  type CustomMethodParams,
  type CustomMethodName,
} from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

export interface ConfigureOptions {
  /**
   * A maximum supported Mini Apps version.
   * @default Being extracted using the `retrieveLaunchParams` function.
   * @see retrieveLaunchParams
   */
  version?: Version;
  /**
   * Custom postEvent function.
   *
   * Passing the "strict" value creates a function, which always checks if specified call supported
   * by currently supported Mini Apps version. If the method is unsupported, an error will be
   * thrown.
   *
   * Passing the "non-strict" value creates a postEvent function not throwing any errors, but
   * warning about a missing method support.
   *
   * @default 'strict'
   * @see createPostEvent
   */
  postEvent?: PostEventFn;
}

/**
 * Signal with a request identifier generator. Usually, you don't need to set this value manually.
 */
export const $createRequestId = signal((() => {
  let requestId = 0;
  return () => (requestId += 1).toString();
})());

/**
 * Signal with a currently used postEvent function across the package.
 */
export const $postEvent = signal<PostEventFn>(_postEvent);

/**
 * Signal with a currently supported maximum Mini Apps version. This value is usually set via
 */
export const $version = signal<Version>('0.0');

/**
 * Configures package global dependencies.
 * @param options - configuration additional options.
 */
export function configure(options?: ConfigureOptions): void {
  options ||= {};
  const { postEvent: optionsPostEvent } = options;
  const v = options.version || retrieveLaunchParams().version;
  $version.set(v);
  $postEvent.set(
    typeof optionsPostEvent === 'function'
      ? optionsPostEvent
      : createPostEvent(v),
  );
}

/**
 * Creates a new request id.
 */
export function createRequestId(): string {
  return $createRequestId()();
}

/**
 * Invokes known custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param options - additional options.
 * @throws {TypedError} ERR_CUSTOM_METHOD_ERR_RESPONSE
 */
export function invokeCustomMethod<M extends CustomMethodName>(
  method: M,
  params: CustomMethodParams<M>,
  options?: ExecuteWithOptions,
): CancelablePromise<unknown>;

/**
 * Invokes unknown custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param options - additional options.
 * @throws {TypedError} ERR_CUSTOM_METHOD_ERR_RESPONSE
 */
export function invokeCustomMethod(
  method: string,
  params: object,
  options?: ExecuteWithOptions,
): CancelablePromise<unknown>;

export function invokeCustomMethod(
  method: string,
  params: object,
  options?: ExecuteWithOptions,
): CancelablePromise<unknown> {
  return _invokeCustomMethod(method, params, createRequestId(), {
    ...options || {},
    postEvent: postEvent,
  });
}

/**
 * `request` function from the bridge with applied global `postEvent` option.
 */
export const request = ((method: any, eventOrEvents: any, options: any) => {
  options ||= {};
  options.postEvent ||= postEvent;
  return _request(method, eventOrEvents, options);
}) as RequestFn;

/**
 * Shortcut for $postEvent call.
 */
export const postEvent = ((method: any, params: any) => {
  return $postEvent()(method, params);
}) as PostEventFn;
