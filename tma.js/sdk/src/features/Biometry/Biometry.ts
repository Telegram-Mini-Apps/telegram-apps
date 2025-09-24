import type { Computed } from '@tma.js/signals';
import type {
  EventPayload,
  BiometryAuthRequestStatus,
  EventListener,
  BiometryTokenUpdateStatus,
} from '@tma.js/bridge';
import { BetterPromise } from 'better-promises';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import { NotAvailableError } from '@/errors.js';
import type { ComponentStorage } from '@/component-storage.js';
import type {
  SharedFeatureOptions,
  WithIsPageReload,
  WithPostEvent,
  WithRequest,
  WithStorage,
  WithVersion,
} from '@/features/types.js';
import type {
  BiometryAuthenticateOptions,
  BiometryRequestAccessOptions,
  BiometryState,
  BiometryUpdateTokenOptions,
} from '@/features/Biometry/types.js';
import type { AsyncOptions } from '@/types.js';
import { Stateful } from '@/composables/Stateful.js';
import { AsyncMountable } from '@/composables/AsyncMountable.js';
import { bound } from '@/helpers/bound.js';
import { teToPromise } from '@/helpers/teToPromise.js';

export type BiometryStorage = ComponentStorage<BiometryState>;

export interface BiometryOptions extends WithVersion,
  WithStorage<BiometryStorage>,
  WithRequest,
  WithPostEvent,
  WithIsPageReload,
  SharedFeatureOptions {
  /**
   * Adds a biometry info received event listener.
   * @param listener - a listener to add.
   */
  onBiometryInfoReceived: (listener: EventListener<'biometry_info_received'>) => void;
  /**
   * Removes a biometry info received event listener.
   * @param listener - a listener to add.
   */
  offBiometryInfoReceived: (listener: EventListener<'biometry_info_received'>) => void;
}

function throwNotAvailable(): never {
  throw new NotAvailableError('Biometry is not available');
}

function eventToState(event: EventPayload<'biometry_info_received'>): BiometryState {
  let available = false;
  let tokenSaved = false;
  let deviceId = '';
  let accessRequested = false;
  let type = '';
  let accessGranted = false;
  if (event.available) {
    available = true;
    tokenSaved = event.token_saved;
    deviceId = event.device_id;
    accessRequested = event.access_requested;
    type = event.type;
    accessGranted = event.access_granted;
  }
  return { available, tokenSaved, deviceId, type, accessGranted, accessRequested };
}

/**
 * @since Mini Apps v7.2
 */
export class Biometry {
  constructor({
    version,
    request,
    postEvent,
    storage,
    onBiometryInfoReceived,
    offBiometryInfoReceived,
    isTma,
    isPageReload,
  }: BiometryOptions) {
    const listener: EventListener<'biometry_info_received'> = event => {
      stateful.setState(eventToState(event));
    };

    const stateful = new Stateful<BiometryState>({
      initialState: {
        available: false,
        type: 'unknown',
        accessGranted: false,
        accessRequested: false,
        deviceId: '',
        tokenSaved: false,
      },
      onChange: storage.set,
    });
    const mountable = new AsyncMountable({
      initialState(options) {
        return pipe(
          request('web_app_biometry_get_info', 'biometry_info_received', options),
          TE.map(eventToState),
        );
      },
      isPageReload,
      onMounted(state) {
        stateful.setState(state);
        onBiometryInfoReceived(listener);
      },
      onUnmounted() {
        offBiometryInfoReceived(listener);
      },
      restoreState: storage.get,
    });

    const wrapOptions = { version, isSupported: 'web_app_biometry_request_auth', isTma } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({
      ...wrapOptions,
      isMounted: mountable.isMounted,
    });

    this.isAvailable = stateful.computedFromState('available');
    this.isMounted = mountable.isMounted;
    this.isSupported = createIsSupportedSignal('web_app_biometry_request_auth', version);
    this.state = stateful.state;
    this.unmount = bound(mountable, 'unmount');
    this.mount = wrapSupported(bound(mountable, 'mount'));

    this.authenticate = wrapComplete(options => {
      return BetterPromise.fn(async () => {
        if (!this.isAvailable()) {
          throwNotAvailable();
        }
        const response = await teToPromise(
          request('web_app_biometry_request_auth', 'biometry_auth_requested', {
            ...options,
            params: { reason: ((options || {}).reason || '').trim() },
          }),
        );
        if (typeof response.token === 'string') {
          stateful.setState({ token: response.token });
        }
        return response;
      });
    });

    this.openSettings = wrapSupported(() => {
      postEvent('web_app_biometry_open_settings');
    });

    this.requestAccess = wrapComplete(options => {
      return teToPromise(
        request('web_app_biometry_request_access', 'biometry_info_received', {
          ...options,
          params: { reason: ((options || {}).reason || '').trim() },
        }),
      ).then(response => {
        const state = eventToState(response);
        if (!state.available) {
          throwNotAvailable();
        }
        stateful.setState(state);
        return state.accessRequested;
      });
    });

    this.updateToken = wrapComplete((options = {}) => {
      return teToPromise(
        request('web_app_biometry_update_token', 'biometry_token_updated', {
          ...options,
          params: { token: options.token || '', reason: options.reason?.trim() },
        }),
      ).then(response => response.status);
    });
  }

  /**
   * Signal indicating if biometry is available.
   */
  readonly isAvailable: Computed<boolean>;

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  /**
   * Signal indicating if the component is mounted.
   */
  readonly isMounted: Computed<boolean>;

  /**
   * Complete component state.
   */
  readonly state: Computed<BiometryState>;

  /**
   * Attempts to authenticate a user using biometrics and fetch a previously stored secure token.
   * @param options - method options.
   * @since Mini Apps v7.2
   * @returns Token from the local secure storage saved previously or undefined.
   * @example
   * const { status, token } = await biometry.authenticate({
   *   reason: 'Authenticate to open wallet',
   * });
   */
  authenticate: SafeWrapped<(options?: BiometryAuthenticateOptions) => BetterPromise<{
    /**
     * Authentication status.
     */
    status: BiometryAuthRequestStatus;
    /**
     * Token from the local secure storage saved previously.
     */
    token?: string;
  }>, true>;

  /**
   * Opens the biometric access settings for bots. Useful when you need to request biometrics
   * access to users who haven't granted it yet.
   *
   * _Note that this method can be called only in response to user interaction with the Mini App
   * interface (e.g. a click inside the Mini App or on the main button)_.
   * @since Mini Apps v7.2
   */
  openSettings: SafeWrapped<() => void, true>;

  /**
   * Requests permission to use biometrics.
   * @since Mini Apps v7.2
   * @returns Promise with true, if access was granted.
   * @example
   * const accessGranted = await biometry.requestAccess({
   *   reason: 'Authenticate to open wallet',
   * });
   */
  requestAccess: SafeWrapped<
    (options?: BiometryRequestAccessOptions) => BetterPromise<boolean>,
    true
  >;

  /**
   * Updates the biometric token in a secure storage on the device.
   * @since Mini Apps v7.2
   * @returns Promise with `true`, if token was updated.
   * @example Setting a new token
   * biometry.updateToken({
   *   token: 'abcdef',
   * })
   * @example Deleting the token
   * biometry.updateToken();
   */
  updateToken: SafeWrapped<
    (options?: BiometryUpdateTokenOptions) => BetterPromise<BiometryTokenUpdateStatus>,
    true
  >;

  /**
   * Mounts the component restoring its state.
   * @since Mini Apps v7.2
   */
  mount: SafeWrapped<(options?: AsyncOptions) => BetterPromise<void>, true>;

  /**
   * Unmounts the component.
   */
  unmount: () => void;
}
