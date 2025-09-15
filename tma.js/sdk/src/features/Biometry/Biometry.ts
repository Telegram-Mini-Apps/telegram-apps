import { computed, type Computed, signal } from '@tma.js/signals';
import {
  on,
  off,
  type EventPayload,
  type BiometryAuthRequestStatus,
  type EventListener,
  type BiometryTokenUpdateStatus,
} from '@tma.js/bridge';
import { BetterPromise } from 'better-promises';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { isPageReload } from '@/navigation.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import { NotAvailableError } from '@/errors.js';
import type { ComponentStorage } from '@/component-storage.js';
import type {
  SharedComponentOptions,
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

export type BiometryStorage = ComponentStorage<BiometryState>;

export interface BiometryOptions extends WithVersion,
  WithStorage<BiometryStorage>,
  WithRequest,
  WithPostEvent,
  SharedComponentOptions {
}

function throwNotAvailable(): never {
  throw new NotAvailableError('Biometry is not available');
}

function biometryInfoEventToState(event: EventPayload<'biometry_info_received'>): BiometryState {
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
  private readonly storage: BiometryStorage;

  private readonly _state = signal<BiometryState>({
    available: false,
    type: '',
    accessGranted: false,
    accessRequested: false,
    deviceId: '',
    tokenSaved: false,
  });

  private readonly _isMounted = signal(false);

  private isListenerBound = false;

  /**
   * Complete biometry state.
   */
  readonly state = computed(this._state);

  /**
   * Signal indicating if biometry is available.
   */
  readonly isAvailable = computed(() => this._state().available);

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted = computed(this._isMounted);

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  constructor({ version, request, postEvent, storage, isTma }: BiometryOptions) {
    this.isSupported = createIsSupportedSignal('web_app_biometry_request_auth', version);
    this.storage = storage;

    const wrapOptions = { version, isSupported: 'web_app_biometry_request_auth', isTma } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({
      ...wrapOptions,
      isMounted: this._isMounted,
    });

    this.mount = wrapSupported(options => {
      if (this._isMounted()) {
        return BetterPromise.resolve();
      }

      const processResult = (state: BiometryState) => {
        if (!this.isListenerBound) {
          on('biometry_info_received', this.onBiometryInfoReceived);
          this.isListenerBound = true;
        }
        this.setState(state);
        this._isMounted.set(true);
      };

      const state = isPageReload() && this.storage.get();
      if (state) {
        return BetterPromise.resolve(state).then(processResult);
      }

      return BetterPromise.fn(async () => {
        await pipe(
          request('web_app_biometry_get_info', 'biometry_info_received', options),
          TE.match(
            error => {
              throw error;
            },
            response => processResult(biometryInfoEventToState(response)),
          ),
        )();
      });
    });

    this.authenticate = wrapComplete(options => {
      return BetterPromise.fn(async () => {
        if (!this.isAvailable()) {
          throwNotAvailable();
        }
        return pipe(
          request('web_app_biometry_request_auth', 'biometry_auth_requested', {
            ...options,
            params: { reason: ((options || {}).reason || '').trim() },
          }),
          TE.match(
            error => {
              throw error;
            },
            response => {
              if (typeof response.token === 'string') {
                this.setState({ ...this._state(), token: response.token });
              }
              return response;
            },
          ),
        )();
      });
    });

    this.openSettings = wrapSupported(() => {
      postEvent('web_app_biometry_open_settings');
    });

    this.requestAccess = wrapComplete(options => {
      return BetterPromise.fn(async () => {
        return pipe(
          request('web_app_biometry_request_access', 'biometry_info_received', {
            ...options,
            params: { reason: ((options || {}).reason || '').trim() },
          }),
          TE.match(
            error => {
              throw error;
            },
            response => {
              const state = biometryInfoEventToState(response);
              if (!state.available) {
                throwNotAvailable();
              }
              this.setState(state);
              return state.accessRequested;
            },
          ),
        )();
      });
    });

    this.updateToken = wrapComplete((options = {}) => {
      return BetterPromise.fn(async () => {
        return pipe(
          request('web_app_biometry_update_token', 'biometry_token_updated', {
            ...options,
            params: { token: options.token || '', reason: options.reason?.trim() },
          }),
          TE.match(error => {
            throw error;
          }, response => response.status),
        )();
      });
    });
  }

  private setState(s: BiometryState): void {
    this._state.set(s);
    this.storage.set(s);
  }

  private onBiometryInfoReceived: EventListener<'biometry_info_received'> = event => {
    this.setState(biometryInfoEventToState(event));
  };

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
   * @see onClick
   */
  unmount() {
    off('biometry_info_received', this.onBiometryInfoReceived);
    this._isMounted.set(false);
  }
}
