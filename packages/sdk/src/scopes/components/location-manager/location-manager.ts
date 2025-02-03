import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, Maybe, setStorageValue } from '@telegram-apps/toolkit';
import { AbortablePromise } from 'better-promises';
import type { EventPayload } from '@telegram-apps/bridge';
import type { Computed } from '@telegram-apps/signals';

import { defineMountFn } from '@/scopes/defineMountFn.js';
import { postEvent, request } from '@/globals.js';
import { createWrapComplete } from '@/scopes/wrappers/createWrapComplete.js';
import { createWrapSupported } from '@/scopes/wrappers/createWrapSupported.js';
import { NotAvailableError } from '@/errors.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';
import { signalCancel } from '@/scopes/signalCancel.js';
import type { AsyncOptions } from '@/types.js';
import { createComputed, createSignal } from '@/signals-registry.js';

const COMPONENT_NAME = 'locationManager';
const CHECK_LOCATION_METHOD = 'web_app_check_location';
const OPEN_SETTINGS_METHOD = 'web_app_open_location_settings';

export interface State {
  /**
   * If true, indicates that location data tracking is available on the current device.
   */
  available: boolean;
  /**
   * Indicates whether the app has previously requested permission to track location data.
   */
  accessRequested: boolean;
  /**
   * Indicates whether the user has granted the app permission to track location data.
   *
   * If false and `accessRequested` is true may indicate that:
   *
   * - The user has simply canceled the permission popup.
   * - The user has denied the app permission to track location data.
   */
  accessGranted: boolean;
}

type StorageValue = State;

const state = createSignal<State>({
  available: false,
  accessGranted: false,
  accessRequested: false,
});

function fromState<K extends keyof State>(key: K): Computed<State[K]> {
  return createComputed(() => state()[key]);
}

/**
 * Signal indicating whether the location data tracking is currently available.
 */
export const isAvailable = fromState('available');

/**
 * Signal indicating whether the user has granted the app permission to track location data.
 */
export const isAccessGranted = fromState('accessGranted');

/**
 * Signal indicating whether the app has previously requested permission to track location data.
 */
export const isAccessRequested = fromState('accessRequested');

/**
 * Converts `location_checked` to some common shape.
 * @param event - event payload.
 * @see location_checked
 */
function eventToState(event: EventPayload<'location_checked'>): State {
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

const [
  mountFn,
  tMountPromise,
  tMountError,
  tIsMounted,
] = defineMountFn(
  COMPONENT_NAME,
  (options?: AsyncOptions) => {
    const s = isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME);
    return s
      ? AbortablePromise.resolve(s)
      : request('web_app_check_location', 'location_checked', options).then(eventToState);
  },
  s => {
    state.set(s);
    setStorageValue<State>(COMPONENT_NAME, s);
  },
);

const wrapSupported = createWrapSupported(COMPONENT_NAME, CHECK_LOCATION_METHOD);
const wrapComplete = createWrapComplete(COMPONENT_NAME, tIsMounted[0], CHECK_LOCATION_METHOD);

/**
 * Mounts the location manager component.
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (mount.isAvailable()) {
 *   await mount();
 * }
 */
export const mount = wrapSupported('mount', mountFn);
export const [, mountPromise, isMounting] = tMountPromise;
export const [, mountError] = tMountError;
export const [_isMounted, isMounted] = tIsMounted;

const [
  reqLocationFn,
  tReqLocationPromise,
  tReqLocationError,
] = defineNonConcurrentFn(
  (options?: AsyncOptions) => {
    return request('web_app_request_location', 'location_requested', options).then(data => {
      if (!data.available) {
        state.set({ ...state(), available: false });
        throw new NotAvailableError('Location data tracking is not available');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { available, ...rest } = data;
      return rest;
    });
  },
  'Location request is currently in progress',
);


/**
 * Requests location data.
 * @since Mini Apps v8.0
 * @returns Promise with location data.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @throws {ConcurrentCallError} Location request is currently in progress
 * @throws {NotAvailableError} Location data tracking is not available
 * @example
 * if (requestLocation.isAvailable()) {
 *   const location = await requestLocation();
 * }
 */
export const requestLocation = wrapComplete('requestLocation', reqLocationFn);
export const [, requestLocationPromise, isRequestingLocation] = tReqLocationPromise;
export const [, requestLocationError] = tReqLocationError;

/**
 * Opens the location access settings for bots. Useful when you need to request location access
 * from users who haven't granted it yet.
 *
 * Note that this method can be called only in response to user interaction with the Mini App
 * interface (e.g., a click inside the Mini App or on the main button).
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (openSettings.isAvailable()) {
 *   openSettings();
 * }
 */
export const openSettings = wrapSupported('openSettings', () => {
  postEvent(OPEN_SETTINGS_METHOD);
}, OPEN_SETTINGS_METHOD);

/**
 * Unmounts the component.
 */
export function unmount(): void {
  signalCancel(requestLocationPromise);
  _isMounted.set(false);
}