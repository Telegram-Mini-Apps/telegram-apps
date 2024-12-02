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
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapComplete } from '@/scopes/toolkit/createWrapComplete.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';
import { createWrapBasic } from '@/scopes/toolkit/createWrapBasic.js';
import { ERR_ALREADY_REQUESTING, ERR_NOT_AVAILABLE } from '@/errors.js';

import {
  state,
  isMounted,
  isRequestingAccess,
  isAuthenticating,
  mountError,
  mountPromise,
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
const INFO_RECEIVED_EVENT = 'biometry_info_received';
const COMPONENT_NAME = 'biometry';

/**
 * @returns True if the biometry manager is supported.
 */
export const isSupported = createIsSupported(REQUEST_AUTH_METHOD);

const wrapBasic = createWrapBasic(COMPONENT_NAME);
const wrapSupported = createWrapSupported(COMPONENT_NAME, REQUEST_AUTH_METHOD);
const wrapComplete = createWrapComplete(COMPONENT_NAME, isMounted, REQUEST_AUTH_METHOD);

function throwNotAvailable(): never {
  throw new TypedError(ERR_NOT_AVAILABLE, 'Biometry is not available');
}

/**
 * Attempts to authenticate a user using biometrics and fetch a previously stored secure token.
 * @param options - method options.
 * @since Mini Apps v7.2
 * @returns Token from the local secure storage saved previously or undefined.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_ALREADY_REQUESTING
 * @throws {TypedError} ERR_NOT_AVAILABLE
 * @example
 * if (authenticate.isAvailable()) {
 *   const { status, token } = await authenticate({
 *     reason: 'Authenticate to open wallet',
 *   });
 * }
 */
export const authenticate = wrapComplete(
  'authenticate',
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
    return CancelablePromise.withFn(async abortSignal => {
      if (isAuthenticating()) {
        throw new TypedError(ERR_ALREADY_REQUESTING, 'Authentication is already in progress');
      }

      const s = state();
      if (!s || !s.available) {
        throwNotAvailable();
      }

      isAuthenticating.set(true);

      try {
        const response = await request(
          REQUEST_AUTH_METHOD,
          'biometry_auth_requested',
          {
            abortSignal,
            params: {
              reason: ((options || {}).reason || '').trim(),
            },
          },
        );

        const { token } = response;
        if (typeof token === 'string') {
          setState({ ...s, token });
        }
        return response;
      } finally {
        isAuthenticating.set(false);
      }
    }, options);
  },
);

/**
 * Opens the biometric access settings for bots. Useful when you need to request biometrics
 * access to users who haven't granted it yet.
 *
 * _Note that this method can be called only in response to user interaction with the Mini App
 * interface (e.g. a click inside the Mini App or on the main button)_.
 * @since Mini Apps v7.2
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (openSettings.isAvailable()) {
 *   openSettings();
 * }
 */
export const openSettings = wrapSupported('openSettings', (): void => {
  postEvent(OPEN_SETTINGS_METHOD);
});

/**
 * Requests permission to use biometrics.
 * @since Mini Apps v7.2
 * @returns Promise with true, if access was granted.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_ALREADY_REQUESTING
 * @throws {TypedError} ERR_NOT_AVAILABLE
 * @example
 * if (requestAccess.isAvailable()) {
 *   const accessGranted = await requestAccess({
 *     reason: 'Authenticate to open wallet',
 *   });
 * }
 */
export const requestAccess = wrapComplete(
  'requestAccess',
  (options?: RequestAccessOptions): CancelablePromise<boolean> => {
    return CancelablePromise.withFn(async abortSignal => {
      if (isRequestingAccess()) {
        throw new TypedError(ERR_ALREADY_REQUESTING, 'Access request is already in progress');
      }
      isRequestingAccess.set(true);

      try {
        const info = await request(REQUEST_ACCESS_METHOD, INFO_RECEIVED_EVENT, {
          abortSignal,
          params: { reason: (options || {}).reason || '' },
        }).then(eventToState);

        if (!info.available) {
          throwNotAvailable();
        }
        setState(info);

        return info.accessGranted;
      } finally {
        isRequestingAccess.set(false);
      }
    }, options);
  },
);

/**
 * Mounts the Biometry component.
 * @since Mini Apps v7.2
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (mount.isAvailable()) {
 *   await mount();
 * }
 */
export const mount = wrapBasic('mount', createMountFn<State>(
  COMPONENT_NAME,
  (options) => {
    const s = isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME);
    return s ? s : requestBiometry(options);
  },
  result => {
    on(INFO_RECEIVED_EVENT, onBiometryInfoReceived);
    setState(result);
  },
  isMounted,
  mountPromise,
  mountError,
));

const onBiometryInfoReceived: EventListener<'biometry_info_received'> = e => {
  setState(eventToState(e));
};

function setState(s: State): void {
  state.set(s);
  setStorageValue<StorageValue>(COMPONENT_NAME, s);
}

/**
 * Unmounts the component.
 */
export function unmount() {
  off(INFO_RECEIVED_EVENT, onBiometryInfoReceived);
  isMounted.set(false);
}

/**
 * Updates the biometric token in a secure storage on the device.
 * @since Mini Apps v7.2
 * @returns Promise with `true`, if token was updated.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example Setting a new token
 * if (updateToken.isAvailable()) {
 *   updateToken({
 *     token: 'abcdef',
 *   })
 * }
 * @example Deleting the token
 * if (updateToken.isAvailable()) {
 *   updateToken();
 * }
 */
export const updateToken = wrapComplete(
  'updateToken',
  (options?: UpdateTokenOptions): CancelablePromise<BiometryTokenUpdateStatus> => {
    options ||= {};
    return request(UPDATE_TOKEN_METHOD, 'biometry_token_updated', {
      ...options,
      params: {
        token: options.token || '',
        reason: options.reason,
      },
    }).then(r => r.status);
  },
);
