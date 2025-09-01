import {
  AbortablePromise,
  type CancelledError,
  type PromiseOptions,
  type TimeoutError,
} from 'better-promises';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function.js';

import { hasWebviewProxy } from '@/env/hasWebviewProxy.js';
import {
  retrieveRawLaunchParamsFp,
} from '@/launch-params/retrieveRawLaunchParams.js';
import { request } from '@/utils/request.js';

export type isTMAError =
  | InstanceType<typeof CancelledError>
  | InstanceType<typeof TimeoutError>;

/**
 * @see isTMAFp
 */
export function isTMA(): boolean;
/**
 * @see isTMAFp
 */
export function isTMA(type: 'complete', options?: PromiseOptions): Promise<boolean>;
export function isTMA(
  type?: 'complete',
  options?: PromiseOptions,
): boolean | Promise<boolean> {
  const monad = isTMAFp(
    // @ts-expect-error TS doesn't get what override we are going to use.
    type,
    options,
  ) as boolean | TE.TaskEither<isTMAError, boolean>;
  return typeof monad === 'function'
    ? pipe(monad, TE.match(
      err => {
        throw err;
      },
      v => v,
    ))()
    : monad;
}

/**
 * Returns true if the current environment is Telegram Mini Apps.
 *
 * It uses the `retrieveLaunchParams` function to determine if the environment
 * contains launch parameters. In case it does, true will be returned.
 *
 * In case you need stricter checks, use async override of this function.
 */
export function isTMAFp(): boolean;
/**
 * Returns promise with true if the current environment is Telegram Mini Apps.
 *
 * First of all, it checks if the current environment contains traits specific
 * to the Mini Apps environment. Then, it attempts to call a Mini Apps method
 * and waits for a response to be received.
 *
 * In case you need less strict checks, use sync override of this function.
 */
export function isTMAFp(
  type: 'complete',
  options?: PromiseOptions
): TE.TaskEither<isTMAError, boolean>;
export function isTMAFp(
  type?: 'complete',
  options?: PromiseOptions,
): boolean | TE.TaskEither<isTMAError, boolean> {
  if (!type) {
    return pipe(retrieveRawLaunchParamsFp(), E.match(() => false, () => true));
  }
  return TE.tryCatch(
    () => AbortablePromise.fn(async context => {
      if (hasWebviewProxy(window)) {
        return true;
      }
      try {
        await request('web_app_request_theme', 'theme_changed', context);
        return true;
      } catch {
        return false;
      }
    }, options || { timeout: 100 }),
    e => e as isTMAError,
  );
}
