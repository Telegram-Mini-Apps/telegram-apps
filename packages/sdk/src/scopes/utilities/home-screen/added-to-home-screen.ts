import { type EventListener, off, on } from '@telegram-apps/bridge';

import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';

const wrapOptions = { isSupported: 'web_app_add_to_home_screen' } as const;
const EVENT_NAME = 'home_screen_added';

/**
 * Adds the event listener that being called whenever the user adds the current mini app to the
 * device's home screen.
 *
 * Note that if the device cannot determine the installation status, a corresponding event may
 * not be received even if the icon has been added.
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (onAddedToHomeScreen.isAvailable()) {
 *   const off = onAddedToHomeScreen(() => {
 *     console.log('Added');
 *     off();
 *   });
 * }
 */
export const onAddedToHomeScreen = wrapSafe(
  'onAddedToHomeScreen',
  (listener: EventListener<typeof EVENT_NAME>, once?: boolean): VoidFunction => {
    return on(EVENT_NAME, listener, once);
  },
  wrapOptions,
);

/**
 * Removes the event listener that being called whenever the user adds the current mini app to the
 * device's home screen.
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (offAddedToHomeScreen.isAvailable()) {
 *   const handler = () => {
 *     console.log('Added');
 *     offAddedToHomeScreen(handler);
 *   };
 *   onAddedToHomeScreen(handler);
 * }
 */
export const offAddedToHomeScreen = wrapSafe(
  'offAddedToHomeScreen',
  (listener: EventListener<typeof EVENT_NAME>): void => {
    off(EVENT_NAME, listener);
  },
  wrapOptions,
);