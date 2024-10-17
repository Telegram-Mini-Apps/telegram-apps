import {
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

import { postEvent, request } from '@/scopes/globals.js';
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
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWithIsSupported } from '@/scopes/toolkit/createWithIsSupported.js';
import { createWithIsMounted } from '@/scopes/toolkit/createWithIsMounted.js';

type StorageValue = State;

const WEB_APP_BIOMETRY_REQUEST_AUTH = 'web_app_biometry_request_auth';
const WEB_APP_BIOMETRY_REQUEST_ACCESS = 'web_app_biometry_request_access';
const WEB_APP_BIOMETRY_OPEN_SETTINGS = 'web_app_biometry_open_settings';
const WEB_APP_BIOMETRY_UPDATE_TOKEN = 'web_app_biometry_update_token';
const BIOMETRY_INFO_RECEIVED = 'biometry_info_received';
const STORAGE_KEY = 'biometry';

/**
 * @returns True if the biometry manager is supported.
 */
export const isSupported = createIsSupported(WEB_APP_BIOMETRY_REQUEST_AUTH);

const withIsSupported = createWithIsSupported(isSupported);
const withIsMounted = createWithIsMounted(isMounted);

/**
 * Attempts to authenticate a user using biometrics and fetch a previously stored
 * secure token.
 * @param options - method options.
 * @since 7.2
 * @returns Token from the local secure storage saved previously or undefined.
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_NOT_AVAILABLE
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const authenticate = withIsMounted(
  (options?: AuthenticateOptions): CancelablePromise<{
    /**
     * Authentication status.
     */
    status: BiometryAuthRequestStatus;
    /**
     * Token from the local secure storage saved previously.
     */
    token?: string;
  }> => {
    if (isAuthenticating()) {
      return CancelablePromise.reject(new TypedError(ERR_ALREADY_CALLED));
    }

    const s = state();
    if (!s || !s.available) {
      return CancelablePromise.reject(new TypedError(ERR_NOT_AVAILABLE));
    }

    isAuthenticating.set(true);

    options ||= {};
    return request(WEB_APP_BIOMETRY_REQUEST_AUTH, 'biometry_auth_requested', {
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
  },
);

/**
 * Opens the biometric access settings for bots. Useful when you need to request biometrics
 * access to users who haven't granted it yet.
 *
 * _Note that this method can be called only in response to user interaction with the Mini App
 * interface (e.g. a click inside the Mini App or on the main button)_.
 * @since 7.2
 */
export const openSettings = withIsSupported((): void => {
  postEvent(WEB_APP_BIOMETRY_OPEN_SETTINGS);
});

/**
 * Requests permission to use biometrics.
 * @since 7.2
 * @returns Promise with true, if access was granted.
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_NOT_AVAILABLE
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const requestAccess = withIsMounted(
  (options?: RequestAccessOptions): CancelablePromise<boolean> => {
    if (isRequestingAccess()) {
      return CancelablePromise.reject(new TypedError(ERR_ALREADY_CALLED));
    }
    isRequestingAccess.set(true);

    options ||= {};
    return request(WEB_APP_BIOMETRY_REQUEST_ACCESS, BIOMETRY_INFO_RECEIVED, {
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
  },
);

/**
 * Mounts the component.
 * @throws {TypedError} ERR_ALREADY_CALLED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const mount = createMountFn<State>(
  (options) => {
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
    on(BIOMETRY_INFO_RECEIVED, onBiometryInfoReceived);
    subAndCall(state, onStateChanged);
    state.set(result);
  },
  { isMounted, mountError, isMounting, isSupported },
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
export function unmount() {
  off(BIOMETRY_INFO_RECEIVED, onBiometryInfoReceived);
  state.unsub(onStateChanged);
}

/**
 * Updates the biometric token in a secure storage on the device.
 * @since 7.2
 * @returns Promise with `true`, if token was updated.
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const updateToken = withIsMounted(
  (options?: UpdateTokenOptions): CancelablePromise<BiometryTokenUpdateStatus> => {
    options ||= {};
    return request(WEB_APP_BIOMETRY_UPDATE_TOKEN, 'biometry_token_updated', {
      ...options,
      params: {
        token: options.token || '',
        reason: options.reason,
      },
    }).then(r => r.status);
  },
);
