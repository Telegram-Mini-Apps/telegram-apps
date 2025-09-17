import { computed, type Computed, signal } from '@tma.js/signals';
import type { EventPayload } from '@tma.js/bridge';
import { Maybe } from '@tma.js/toolkit';
import { BetterPromise } from 'better-promises';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { isPageReload } from '@/navigation.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { AsyncOptions } from '@/types.js';
import type {
  LocationManagerOptions,
  LocationManagerRequestLocationResponse,
  LocationManagerState,
} from '@/features/LocationManager/types.js';

function locationEventToState(event: EventPayload<'location_checked'>): LocationManagerState {
  let available = false;
  let accessRequested: Maybe<boolean>;
  let accessGranted: Maybe<boolean>;
  if (event.available) {
    available = true;
    accessRequested = event.access_requested;
    accessGranted = event.access_granted;
  }
  return {
    available,
    accessGranted: accessGranted || false,
    accessRequested: accessRequested || false,
  };
}

/**
 * @since Mini Apps v8.0
 */
export class LocationManager {
  private readonly _state = signal<LocationManagerState>({
    available: false,
    accessGranted: false,
    accessRequested: false,
  });

  private readonly _isMounted = signal(false);

  /**
   * Complete location manager state.
   */
  readonly state = computed(this._state);

  /**
   * Signal indicating whether the location data tracking is currently available.
   */
  readonly isAvailable = this.fromState('available');

  /**
   * Signal indicating whether the user has granted the app permission to track location data.
   */
  readonly isAccessGranted = this.fromState('accessGranted');

  /**
   * Signal indicating whether the app has previously requested permission to track location data.
   */
  readonly isAccessRequested = this.fromState('accessRequested');

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted = computed(this._isMounted);

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  constructor({ version, request, postEvent, storage, isTma }: LocationManagerOptions) {
    this.isSupported = createIsSupportedSignal('web_app_check_location', version);

    const wrapOptions = { version, isSupported: 'web_app_check_location', isTma } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({
      ...wrapOptions,
      isMounted: this._isMounted,
    });

    const setState = (state: LocationManagerState) => {
      storage.set(state);
      this._state.set(state);
    };

    this.mount = wrapSupported(options => {
      if (this._isMounted()) {
        return BetterPromise.resolve();
      }

      const processResult = (state: LocationManagerState) => {
        setState(state);
        this._isMounted.set(true);
      };

      const state = isPageReload() && storage.get();
      if (state) {
        return BetterPromise.resolve(state).then(processResult);
      }

      return BetterPromise.fn(async () => {
        await pipe(
          request('web_app_check_location', 'location_checked', options),
          TE.match(
            error => {
              throw error;
            },
            response => processResult(locationEventToState(response)),
          ),
        )();
      });
    });

    this.openSettings = wrapSupported(() => {
      postEvent('web_app_open_location_settings');
    });

    this.requestLocation = wrapComplete(options => {
      return BetterPromise.fn(async () => {
        return pipe(
          request('web_app_request_location', 'location_requested', options),
          TE.match(
            error => {
              throw error;
            },
            response => {
              if (!response.available) {
                setState({ ...this._state(), available: false });
                return null;
              }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { available, ...rest } = response;
              return rest;
            },
          ),
        )();
      });
    });
  }

  private fromState<K extends keyof LocationManagerState>(
    key: K,
  ): Computed<LocationManagerState[K]> {
    return computed(() => this._state()[key]);
  }

  /**
   * Opens the location access settings for bots. Useful when you need to request location access
   * from users who haven't granted it yet.
   *
   * Note that this method can be called only in response to user interaction with the Mini App
   * interface (e.g., a click inside the Mini App or on the main button).
   * @since Mini Apps v8.0
   */
  openSettings: SafeWrapped<() => void, true>;

  /**
   * Requests location data.
   * @since Mini Apps v8.0
   * @returns Promise with location data or null it access was not granted.
   */
  requestLocation: SafeWrapped<
    (options?: AsyncOptions) => BetterPromise<LocationManagerRequestLocationResponse | null>,
    true
  >;

  /**
   * Mounts the component restoring its state.
   * @since Mini Apps v8.0
   */
  mount: SafeWrapped<(options?: AsyncOptions) => BetterPromise<void>, true>;

  /**
   * Unmounts the component.
   */
  unmount() {
    this._isMounted.set(false);
  }
}
