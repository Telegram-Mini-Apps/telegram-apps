import { signalifyAsyncFn } from '@/scopes/signalifyAsyncFn.js';
import { type AsyncOptions, CancelablePromise, TypedError } from '@telegram-apps/bridge';

import { request } from '@/scopes/globals.js';
import { ERR_ALREADY_REQUESTING, ERR_FULLSCREEN_FAILED } from '@/errors.js';
import { createWrapComplete } from '@/scopes/toolkit/createWrapComplete.js';

import {
  COMPONENT_NAME,
  FS_CHANGED_EVENT,
  FS_FAILED_EVENT,
  REQUEST_FS_METHOD,
} from '../../const.js';
import {
  changeFullscreenError,
  changeFullscreenPromise,
  isFullscreen,
} from '../../signals/fullscreen.js';
import { isMounted } from '../../signals/mounting.js';
import { setState } from '@/scopes/components/viewport/signals/state.js';

const wrapComplete = createWrapComplete(COMPONENT_NAME, isMounted, REQUEST_FS_METHOD);

export function createFullscreenFn(
  method: string,
  requestMethod: 'web_app_exit_fullscreen' | 'web_app_request_fullscreen',
) {
  return wrapComplete(method, signalifyAsyncFn(
    (options?: AsyncOptions): CancelablePromise<void> => {
      return request(requestMethod, [FS_CHANGED_EVENT, FS_FAILED_EVENT], options)
        .then(result => {
          if ('error' in result) {
            if (result.error === 'ALREADY_FULLSCREEN') {
              return true;
            }
            throw new TypedError(ERR_FULLSCREEN_FAILED, 'Fullscreen request failed', result.error);
          }
          return result.is_fullscreen;
        })
        .then(value => {
          value !== isFullscreen() && setState({ isFullscreen: value });
        });
    },
    () => {
      return new TypedError(ERR_ALREADY_REQUESTING, 'Fullscreen mode change is already being requested');
    },
    changeFullscreenPromise,
    changeFullscreenError,
  ));
}
