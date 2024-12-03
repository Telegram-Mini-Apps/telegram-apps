import { on, off, type EventListener } from "@telegram-apps/bridge";
import {wrapMounted} from "@/scopes/components/viewport/methods/wrappers.js";

const ACTIVATED_EVENT = 'activated';

/**
 * Adds a new Activated listener.
 * Event happens when app became visible from hidden or collapsed state.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (onActivated.isAvailable()) {
 *   const off = onActivated(() => {
 *     console.log('User activated the Mini App');
 *     off();
 *   });
 * }
 */
export const onActivated = wrapMounted(
  'onActivated',
  (fn: EventListener<'activated'>): VoidFunction => on(ACTIVATED_EVENT, fn),
);

/**
 * Removes the Activated listener.
 * @param fn - an event listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (offActivated.isAvailable()) {
 *   function listener() {
 *     console.log('User opened mini app');
 *     offActivated(listener);
 *   }
 *   onActivated(listener);
 * }
 */
export const offActivated = wrapMounted(
  'offActivated',
  (fn: EventListener<'activated'>): void => off(ACTIVATED_EVENT, fn),
);