import {
  retrieveLaunchParams,
  postEvent as _postEvent,
  request as _request,
  invokeCustomMethod as _invokeCustomMethod,
  createPostEvent,
  type PostEventFn,
  type RequestFn,
  type InvokeCustomMethodOptions,
  type CustomMethodParams,
  type CustomMethodName,
} from '@telegram-apps/bridge';
import type { AbortablePromise } from 'better-promises';
import type { LaunchParamsLike } from '@telegram-apps/transformers';

import { createComputed, createSignal, createSignalsTuple } from '@/signals-registry.js';
import { logInfo } from '@/debug.js';

/**
 * Launch parameters stored in the package state.
 */
export type PackageLaunchParams =
  & Omit<LaunchParamsLike, 'tgWebAppThemeParams'>
  & Partial<Pick<LaunchParamsLike, 'tgWebAppThemeParams'>>;

export interface ConfigureOptions {
  /**
   * Launch parameters used across the package.
   * @default Being extracted using the `retrieveLaunchParams` function.
   * @see retrieveLaunchParams
   */
  launchParams?: PackageLaunchParams;
  /**
   * Custom postEvent function.
   * @default The `createPostEvent` function will be used with the version, specified in
   * the `launchParams` option.
   * @see createPostEvent
   */
  postEvent?: PostEventFn;
}

const $lastRequestId = createSignal(0);
export const $postEvent = createSignal<PostEventFn>(_postEvent);
export const [_launchParams, launchParams] =
  createSignalsTuple<PackageLaunchParams>({
    tgWebAppPlatform: 'unknown',
    tgWebAppVersion: '0.0',
  });

export const version = createComputed(() => launchParams().tgWebAppVersion);

/**
 * Configures package global dependencies.
 * @param options - configuration additional options.
 */
export function configure(options?: ConfigureOptions): void {
  options ||= {};
  const { postEvent } = options;
  const lp = options.launchParams || retrieveLaunchParams();
  _launchParams.set(lp);
  $postEvent.set(
    typeof postEvent === 'function'
      ? postEvent
      : createPostEvent(lp.tgWebAppVersion),
  );
  logInfo(false, 'The package was configured. Launch params:', _launchParams());
}

/**
 * @returns A new request identifier.
 */
export function createRequestId(): string {
  $lastRequestId.set($lastRequestId() + 1);
  return $lastRequestId().toString();
}

/**
 * Invokes known custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param options - additional options.
 * @throws {InvokeCustomMethodError} Invocation completed with some error.
 */
export function invokeCustomMethod<M extends CustomMethodName>(
  method: M,
  params: CustomMethodParams<M>,
  options?: InvokeCustomMethodOptions,
): AbortablePromise<unknown>;

/**
 * Invokes unknown custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param options - additional options.
 * @throws {InvokeCustomMethodError} Invocation completed with some error.
 */
export function invokeCustomMethod(
  method: string,
  params: object,
  options?: InvokeCustomMethodOptions,
): AbortablePromise<unknown>;

export function invokeCustomMethod(
  method: string,
  params: object,
  options?: InvokeCustomMethodOptions,
): AbortablePromise<unknown> {
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
