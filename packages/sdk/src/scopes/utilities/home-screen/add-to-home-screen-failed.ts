import { on, type EventListener, off } from '@telegram-apps/bridge';

import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';

const wrapOptions = { isSupported: 'web_app_add_to_home_screen' } as const;
const EVENT_NAME = 'home_screen_failed';

/**
 * Adds the event listener that being called whenever the user declines the request to add the
 * current mini app to the device's home screen.
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (onAddToHomeScreenFailed.isAvailable()) {
 *   const off = onAddToHomeScreenFailed(() => {
 *     console.log('Failed to add to home screen');
 *     off();
 *   });
 * }
 */
export const onAddToHomeScreenFailed = wrapSafe(
  'onAddToHomeScreenFailed',
  (listener: EventListener<typeof EVENT_NAME>, once?: boolean): VoidFunction => {
    return on(EVENT_NAME, listener, once);
  },
  { isSupported: 'web_app_add_to_home_screen' },
);

/**
 * Removes add to home screen failed event listener.
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (offAddToHomeScreenFailed.isAvailable()) {
 *   const handler = () => {
 *     console.log('Failed to add');
 *     offAddToHomeScreenFailed(handler);
 *   };
 *   onAddToHomeScreenFailed(handler);
 * }
 */
export const offAddToHomeScreenFailed = wrapSafe(
  'offAddToHomeScreenFailed',
  (listener: EventListener<typeof EVENT_NAME>): void => {
    off(EVENT_NAME, listener);
  },
  wrapOptions,
);