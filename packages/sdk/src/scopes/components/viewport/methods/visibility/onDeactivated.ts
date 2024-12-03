import { on, off, type EventListener } from "@telegram-apps/bridge";
import { wrapMounted } from "@/scopes/components/viewport/methods/wrappers.js";

const DEACTIVATED_EVENT = 'deactivated';

/**
 * Adds a new Deactivated listener.
 * Event happens when app became invisible, e.g. hidden or collapsed by user.
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
export const onDeactivated = wrapMounted(
  'onDeactivated',
  (fn: EventListener<'deactivated'>): VoidFunction => on(DEACTIVATED_EVENT, fn),
);

/**
 * Removes the Dectivated listener.
 * @param fn - an event listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (offDeactivated.isAvailable()) {
 *   function listener() {
 *     console.log('User opened mini app');
 *     offDeactivated(listener);
 *   }
 *   onDeactivated(listener);
 * }
 */
export const offDeactivated = wrapMounted(
  'offDeactivated',
  (fn: EventListener<'deactivated'>): void => off(DEACTIVATED_EVENT, fn),
);