import type { AbortablePromise, PromiseOptions } from 'better-promises';

import { request } from '@/globals.js';
import { FullscreenFailedError } from '@/errors.js';
import { createWrapComplete } from '@/scopes/wrappers/createWrapComplete.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';

import { COMPONENT_NAME, FS_CHANGED_EVENT } from './const.js';
import { setState, signalFromState } from './signals.js';
import { _isMounted } from './mounting.js';
import { createSignalsTuple } from '@/signals-registry.js';

const REQUEST_METHOD_NAME = 'web_app_request_fullscreen';
const wrapComplete = createWrapComplete(COMPONENT_NAME, _isMounted, REQUEST_METHOD_NAME);

/**
 * Signal indicating if the viewport is currently in fullscreen mode.
 */
export const isFullscreen = signalFromState('isFullscreen');

/**
 * Signal containing fullscreen request or exit promise.
 */
export const [
  _changeFullscreenPromise,
  changeFullscreenPromise,
] = createSignalsTuple<AbortablePromise<void>>();

/**
 * Signal containing an error received during the last fullscreen mode request.
 */
export const [
  _changeFullscreenError,
  changeFullscreenError,
] = createSignalsTuple<Error | undefined>();

function createFullscreenFn(method: string, isRequest?: boolean) {
  return wrapComplete(
    method,
    defineNonConcurrentFn(
      (options?: PromiseOptions) => {
        return request(
          isRequest ? REQUEST_METHOD_NAME : 'web_app_exit_fullscreen',
          [FS_CHANGED_EVENT, 'fullscreen_failed'],
          options,
        )
          .then(data => {
            if ('error' in data && data.error !== 'ALREADY_FULLSCREEN') {
              throw new FullscreenFailedError(data.error);
            }
            const value = 'is_fullscreen' in data ? data.is_fullscreen : true;
            value !== isFullscreen() && setState({ isFullscreen: value });
          });
      },
      'Fullscreen mode change is already being requested',
      {
        promise: _changeFullscreenPromise,
        error: _changeFullscreenError,
      },
    )[0],
  );
}

/**
 * Requests fullscreen mode for the mini application.
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FullscreenFailedError}
 * @example Using `isAvailable()`
 * if (requestFullscreen.isAvailable() && !isChangingFullscreen()) {
 *   await requestFullscreen();
 * }
 * @example Using `ifAvailable()`
 * if (!isChangingFullscreen()) {
 *   await requestFullscreen.ifAvailable();
 * }
 */
export const requestFullscreen = createFullscreenFn('requestFullscreen', true);

/**
 * Exits mini application fullscreen mode.
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FullscreenFailedError}
 * @example Using `isAvailable()`
 * if (exitFullscreen.isAvailable() && !isChangingFullscreen()) {
 *   await exitFullscreen();
 * }
 * @example Using `ifAvailable()`
 * if (!isChangingFullscreen()) {
 *   await exitFullscreen.ifAvailable();
 * }
 */
export const exitFullscreen = createFullscreenFn('exitFullscreen');