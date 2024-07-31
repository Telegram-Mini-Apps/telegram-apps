import { isPageReload } from '@/navigation/isPageReload.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { on } from '@/bridge/events/listening/on.js';
import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import { request as bridgeRequest } from '@/bridge/request.js';
import { postEvent } from '@/scopes/globals/globals.js';
import type { BiometryTokenUpdateStatus, MiniAppsEventListener } from '@/bridge/events/types.js';

import * as _ from './private.js';
import { request } from './static.js';
import { formatEvent } from './formatEvent.js';
import type {
  State,
  AuthenticateOptions,
  RequestAccessOptions,
  UpdateTokenOptions,
} from './types.js';

let authPromise: Promise<string | undefined> | undefined;
let accessPromise: Promise<boolean> | undefined;

const REQUEST_AUTH_METHOD = 'web_app_biometry_request_auth';
const REQUEST_ACCESS_METHOD = 'web_app_biometry_request_access';
const OPEN_SETTINGS_METHOD = 'web_app_biometry_open_settings';
const UPDATE_TOKEN_METHOD = 'web_app_biometry_update_token';

/**
 * Attempts to authenticate a user using biometrics and fetch a previously stored
 * secure token.
 * @param options - method options.
 * @since 7.2
 * @returns Token from the local secure storage saved previously or undefined.
 */
const authenticate: WithIsSupported<(options?: AuthenticateOptions) => Promise<string | undefined>> = decorateWithIsSupported((options) => {
  if (!authPromise) {
    options ||= {};
    authPromise = bridgeRequest({
      ...options,
      method: REQUEST_AUTH_METHOD,
      event: 'biometry_auth_requested',
      postEvent: postEvent(),
      params: {
        reason: (options.reason || '').trim(),
      },
    })
      .then(({ token }) => {
        _.state.set({ ..._.state(), token });
        return token;
      })
      .finally(() => authPromise = undefined);
  }
  return authPromise;
}, REQUEST_AUTH_METHOD);

/**
 * Opens the biometric access settings for bots. Useful when you need to request biometrics
 * access to users who haven't granted it yet.
 *
 * _Note that this method can be called only in response to user interaction with the Mini App
 * interface (e.g. a click inside the Mini App or on the main button)_.
 * @since 7.2
 */
const openSettings: WithIsSupported<() => void> = decorateWithIsSupported(() => {
  postEvent()(OPEN_SETTINGS_METHOD);
}, OPEN_SETTINGS_METHOD);

/**
 * Requests permission to use biometrics.
 * @since 7.2
 * @returns Promise with true, if access was granted.
 */
const requestAccess: WithIsSupported<(options?: RequestAccessOptions) => Promise<boolean>> =
  decorateWithIsSupported((options) => {
    if (!accessPromise) {
      options ||= {};
      accessPromise = bridgeRequest({
        ...options,
        postEvent: postEvent(),
        method: REQUEST_ACCESS_METHOD,
        event: 'biometry_info_received',
        params: { reason: options.reason || '' },
      })
        .then((response) => {
          const s = formatEvent(response);
          _.state.set(s);
          return s.accessGranted;
        })
        .finally(() => accessPromise = undefined);
    }
    return accessPromise;
  }, REQUEST_ACCESS_METHOD);

/**
 * Mounts the component.
 */
function mount(): void {
  if (_.isMounting() || _.isMounted()) {
    return;
  }

  if (!request.isSupported()) {
    _.isMounted.set(true);
    return;
  }

  _.isMounting.set(true);

  function finalizeMount(state: State): void {
    on('biometry_info_received', onBiometryInfoReceived);
    _.state.set(state);
    _.state.sub(onStateChanged);
    _.mountError.set(undefined);
    _.isMounting.set(false);
    _.isMounted.set(true);
  }

  // Try to restore the state using the storage.
  const s = isPageReload() && getStorageValue('biometryManager');
  if (s) {
    return finalizeMount(s);
  }

  // We were unable to retrieve data locally. In this case, we are sending a request returning
  // the biometry information.
  request({ timeout: 1000 }).then(finalizeMount).catch(e => {
    _.mountError.set(e);
    _.isMounting.set(false);
    _.isMounted.set(false);
  });
}

const onBiometryInfoReceived: MiniAppsEventListener<'biometry_info_received'> = e => {
  _.state.set(formatEvent(e));
};

function onStateChanged(s: State): void {
  setStorageValue('biometryManager', s);
}

/**
 * Unmounts the component.
 */
function unmount(): void {

}

/**
 * Updates the biometric token in a secure storage on the device.
 * @since 7.2
 * @returns Promise with `true`, if token was updated.
 */
const updateToken: WithIsSupported<(options?: UpdateTokenOptions) => Promise<BiometryTokenUpdateStatus>> =
  decorateWithIsSupported((options) => {
    options ||= {};
    return bridgeRequest({
      ...options,
      postEvent: postEvent(),
      method: UPDATE_TOKEN_METHOD,
      event: 'biometry_token_updated',
      params: { token: options.token || '', reason: options.reason },
    }).then(r => r.status);
  }, UPDATE_TOKEN_METHOD);

export {
  authenticate,
  mount,
  openSettings,
  requestAccess,
  unmount,
  updateToken,
};
export {
  state,
  mountError,
  isMounted,
  isMounting,
} from './computed.js';