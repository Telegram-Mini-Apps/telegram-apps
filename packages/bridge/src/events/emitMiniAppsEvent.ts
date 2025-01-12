import type { EventWithoutPayload, EventWithPayload, EventPayload } from '@/events/types/index.js';

/**
 * Emits an event without payload sent from the Telegram native application like it was sent in
 * a default web environment between two iframes.
 *
 * It dispatches a new MessageEvent and expects it to be handled via
 * the `window.addEventListener('message', ...)` call, as a developer would do it to handle
 * messages sent from the parent iframe.
 * @param eventType - event name.
 */
export function emitMiniAppsEvent<E extends EventWithoutPayload>(eventType: E): void;

/**
 * Emits an event with payload sent from the Telegram native application like it was sent in
 * a default web environment between two iframes.
 *
 * It dispatches a new MessageEvent and expects it to be handled via
 * the `window.addEventListener('message', ...)` call, as a developer would do it to handle
 * messages sent from the parent iframe.
 * @param eventType - event name.
 * @param eventData - event payload.
 */
export function emitMiniAppsEvent<E extends EventWithPayload>(
  eventType: E,
  eventData: EventPayload<E>,
): void;

/**
 * Emits an unknown event sent from the Telegram native application like it was sent in a default
 * web environment between two iframes.
 *
 * It dispatches a new MessageEvent and expects it to be handled via
 * the `window.addEventListener('message', ...)` call, as a developer would do it to handle
 * messages sent from the parent iframe.
 * @param eventType - event name.
 * @param eventData - event payload.
 */
export function emitMiniAppsEvent<E extends string>(
  eventType: E,
  eventData: E extends EventWithoutPayload
    ? never
    : E extends EventWithPayload
      ? EventPayload<E>
      : unknown,
): void;

/**
 * Emits an event sent from the Telegram native application like it was sent in a default web
 * environment between two iframes.
 *
 * It dispatches a new MessageEvent and expects it to be handled via
 * the `window.addEventListener('message', ...)` call, as a developer would do it to handle
 * messages sent from the parent iframe.
 * @param eventType - event name.
 * @param eventData - event payload.
 */
export function emitMiniAppsEvent(eventType: string, eventData?: unknown): void {
  window.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({ eventType, eventData }),
    // We specify window.parent to imitate the case, the parent iframe sent us this event.
    source: window.parent,
  }));
}
