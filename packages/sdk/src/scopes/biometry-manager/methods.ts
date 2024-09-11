import {
  request,
  supports,
  on,
  off,
  type BiometryTokenUpdateStatus,
  type EventListener,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';
import { CancelablePromise, getStorageValue, setStorageValue } from '@telegram-apps/toolkit';

import { withIsSupported, type WithIsSupported } from '@/scopes/withIsSupported.js';
import { $postEvent, $version } from '@/scopes/globals/globals.js';
import { createMountFn } from '@/scopes/createMountFn.js';
import { SDKError } from '@/errors/SDKError.js';
import { ERR_ALREADY_CALLED, ERR_NOT_AVAILABLE } from '@/errors/errors.js';

import {
  state,
  mountError,
  isMounted,
} from './signals.js';
import { authenticatePromise, mountPromise, requestAccessPromise } from './private.js';
import * as BiometryManager from './static.js';
import { eventToState } from './eventToState.js';
import type {
  State,
  AuthenticateOptions,
  RequestAccessOptions,
  UpdateTokenOptions,
} from './types.js';

type StorageValue = State;

const REQUEST_AUTH_METHOD = 'web_app_biometry_request_auth';
const REQUEST_ACCESS_METHOD = 'web_app_biometry_request_access';
const OPEN_SETTINGS_METHOD = 'web_app_biometry_open_settings';
const UPDATE_TOKEN_METHOD = 'web_app_biometry_update_token';
const BIOMETRY_INFO_RECEIVED_EVENT = 'biometry_info_received';

/**
 * Attempts to authenticate a user using biometrics and fetch a previously stored
 * secure token.
 * @param options - method options.
 * @since 7.2
 * @returns Token from the local secure storage saved previously or undefined.
 * @throws {SDKError} ERR_ALREADY_CALLED
 * @throws {SDKError} ERR_NOT_AVAILABLE
 */
export const authenticate: WithIsSupported<
  (options?: AuthenticateOptions) => CancelablePromise<string | undefined>
> = withIsSupported((options) => {
  if (authenticatePromise()) {
    return CancelablePromise.reject(new SDKError(ERR_ALREADY_CALLED));
  }

  const s = state();
  if (!s || !s.available) {
    return CancelablePromise.reject(new SDKError(ERR_NOT_AVAILABLE));
  }

  options ||= {};
  const promise = request(REQUEST_AUTH_METHOD, 'biometry_auth_requested', {
    postEvent: $postEvent(),
    ...options,
    params: { reason: (options.reason || '').trim() },
  })
    .then(({ token }) => {
      if (typeof token === 'string') {
        state.set({ ...s, token });
      }
      return token;
    })
    .finally(() => {
      authenticatePromise.set(undefined);
    });
  authenticatePromise.set(promise);

  return promise;
}, REQUEST_AUTH_METHOD);

/**
 * @returns True if biometry manager is supported.
 */
export function isSupported(): boolean {
  return supports(REQUEST_AUTH_METHOD, $version());
}

/**
 * Opens the biometric access settings for bots. Useful when you need to request biometrics
 * access to users who haven't granted it yet.
 *
 * _Note that this method can be called only in response to user interaction with the Mini App
 * interface (e.g. a click inside the Mini App or on the main button)_.
 * @since 7.2
 */
export const openSettings: WithIsSupported<() => void> = withIsSupported(() => {
  $postEvent()(OPEN_SETTINGS_METHOD);
}, OPEN_SETTINGS_METHOD);

/**
 * Requests permission to use biometrics.
 * @since 7.2
 * @returns Promise with true, if access was granted.
 * @throws {SDKError} ERR_ALREADY_CALLED
 */
export const requestAccess: WithIsSupported<
  (options?: RequestAccessOptions) => CancelablePromise<boolean>
> = withIsSupported((options) => {
  if (requestAccessPromise()) {
    return CancelablePromise.reject(new SDKError(ERR_ALREADY_CALLED));
  }

  options ||= {};
  const promise = request(REQUEST_ACCESS_METHOD, BIOMETRY_INFO_RECEIVED_EVENT, {
    postEvent: $postEvent(),
    ...options,
    params: { reason: options.reason || '' },
  })
    .then(eventToState)
    .then((info) => {
      if (!info.available) {
        throw new SDKError(ERR_NOT_AVAILABLE);
      }
      state.set(info);
      return info.accessGranted;
    })
    .finally(() => {
      requestAccessPromise.set(undefined);
    });

  requestAccessPromise.set(promise);

  return promise;
}, REQUEST_ACCESS_METHOD);

/**
 * Mounts the component.
 */
export const mount = createMountFn<State>(
  (options) => {
    // May be not supported.
    if (!isSupported()) {
      return { available: false };
    }

    // Try to restore the state using the storage.
    const s = isPageReload() && getStorageValue<StorageValue>('biometryManager');
    if (s) {
      return s;
    }

    // We were unable to retrieve data locally. In this case, we are sending a request returning
    // the biometry information.
    options ||= {};
    options.timeout ||= 1000;
    return BiometryManager.request(options);
  },
  result => {
    on(BIOMETRY_INFO_RECEIVED_EVENT, onBiometryInfoReceived);
    state.sub(onStateChanged);
    state.set(result);
  },
  { isMounted, mountError, mountPromise },
);

const onBiometryInfoReceived: EventListener<'biometry_info_received'> = e => {
  state.set(eventToState(e));
};

function onStateChanged(s: State | undefined) {
  s && setStorageValue<StorageValue>('biometryManager', s);
}

/**
 * Unmounts the component.
 */
export function unmount(): void {
  off(BIOMETRY_INFO_RECEIVED_EVENT, onBiometryInfoReceived);
  state.unsub(onStateChanged);
}

/**
 * Updates the biometric token in a secure storage on the device.
 * @since 7.2
 * @returns Promise with `true`, if token was updated.
 */
export const updateToken: WithIsSupported<
  (options?: UpdateTokenOptions) => CancelablePromise<BiometryTokenUpdateStatus>
> = withIsSupported((options) => {
  options ||= {};
  return request(UPDATE_TOKEN_METHOD, 'biometry_token_updated', {
    postEvent: $postEvent(),
    ...options,
    params: {
      token: options.token || '',
      reason: options.reason,
    },
  }).then(r => r.status);
}, UPDATE_TOKEN_METHOD);
