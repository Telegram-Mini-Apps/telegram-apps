import {
  supports,
  on,
  off,
  TypedError,
  CancelablePromise,
  getStorageValue,
  setStorageValue,
  type BiometryTokenUpdateStatus,
  type BiometryAuthRequestStatus,
  type EventListener,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';

import { $version, postEvent, request } from '@/scopes/globals.js';
import { createMountFn } from '@/scopes/createMountFn.js';
import { subAndCall } from '@/utils/subAndCall.js';
import { ERR_ALREADY_CALLED, ERR_NOT_AVAILABLE } from '@/errors.js';

import {
  state,
  mountError,
  isMounted,
  isRequestingAccess,
  isAuthenticating,
  isMounting,
} from './signals.js';
import { requestBiometry } from './requestBiometry.js';
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
const STORAGE_KEY = 'biometry';

/**
 * Attempts to authenticate a user using biometrics and fetch a previously stored
 * secure token.
 * @param options - method options.
 * @since 7.2
 * @returns Token from the local secure storage saved previously or undefined.
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_NOT_AVAILABLE
 */
export function authenticate(options?: AuthenticateOptions): CancelablePromise<{
  /**
   * Authentication status.
   */
  status: BiometryAuthRequestStatus;
  /**
   * Token from the local secure storage saved previously.
   */
  token?: string;
}> {
  if (isAuthenticating()) {
    return CancelablePromise.reject(new TypedError(ERR_ALREADY_CALLED));
  }

  const s = state();
  if (!s || !s.available) {
    return CancelablePromise.reject(new TypedError(ERR_NOT_AVAILABLE));
  }

  isAuthenticating.set(true);

  options ||= {};
  return request(REQUEST_AUTH_METHOD, 'biometry_auth_requested', {
    ...options,
    params: { reason: (options.reason || '').trim() },
  })
    .then(response => {
      const { token } = response;
      if (typeof token === 'string') {
        state.set({ ...s, token });
      }
      return response;
    })
    .finally(() => {
      isAuthenticating.set(false);
    });
}

/**
 * @returns True if the biometry manager is supported.
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
export function openSettings(): void {
  postEvent(OPEN_SETTINGS_METHOD);
}

/**
 * Requests permission to use biometrics.
 * @since 7.2
 * @returns Promise with true, if access was granted.
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_NOT_AVAILABLE
 */
export function requestAccess(options?: RequestAccessOptions): CancelablePromise<boolean> {
  if (isRequestingAccess()) {
    return CancelablePromise.reject(new TypedError(ERR_ALREADY_CALLED));
  }
  isRequestingAccess.set(true);

  options ||= {};
  return request(REQUEST_ACCESS_METHOD, BIOMETRY_INFO_RECEIVED_EVENT, {
    ...options,
    params: { reason: options.reason || '' },
  })
    .then(eventToState)
    .then((info) => {
      if (!info.available) {
        throw new TypedError(ERR_NOT_AVAILABLE);
      }
      state.set(info);
      return info.accessGranted;
    })
    .finally(() => {
      isRequestingAccess.set(false);
    });
}

/**
 * Mounts the component.
 * @throws {TypedError} ERR_ALREADY_CALLED
 */
export const mount = createMountFn<State>(
  (options) => {
    // May be not supported.
    if (!isSupported()) {
      return { available: false };
    }

    // Try to restore the state using the storage.
    const s = isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY);
    if (s) {
      return s;
    }

    // We were unable to retrieve data locally. In this case, we are sending a request returning
    // the biometry information.
    return requestBiometry(options);
  },
  result => {
    on(BIOMETRY_INFO_RECEIVED_EVENT, onBiometryInfoReceived);
    subAndCall(state, onStateChanged);
    state.set(result);
  },
  { isMounted, mountError, isMounting },
);

const onBiometryInfoReceived: EventListener<'biometry_info_received'> = e => {
  state.set(eventToState(e));
};

function onStateChanged(): void {
  const s = state();
  s && setStorageValue<StorageValue>(STORAGE_KEY, s);
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
export function updateToken(options?: UpdateTokenOptions): CancelablePromise<BiometryTokenUpdateStatus> {
  options ||= {};
  return request(UPDATE_TOKEN_METHOD, 'biometry_token_updated', {
    ...options,
    params: {
      token: options.token || '',
      reason: options.reason,
    },
  }).then(r => r.status);
}
