import type { EventName, EventPayload } from '@/events/types/index.js';
import type { If, IsNever } from '@telegram-apps/toolkit';

type EventsWithoutPayload = {
  [E in EventName]: If<IsNever<EventPayload<E>>, never, E>
}[EventName];

type EventsWithRequiredPayload = {
  [E in EventName]: undefined extends EventPayload<E> ? never : E
}[EventName];

/**
 * Emits an event without payload sent from the Telegram native application like it was sent in
 * a default web environment between two iframes.
 *
 * It dispatches a new MessageEvent and expects it to be handled via
 * the `window.addEventListener('message', ...)` call, as a developer would do it to handle
 * messages sent from the parent iframe.
 * @param eventType - event name.
 */
export function emitMiniAppsEvent<E extends EventsWithoutPayload>(eventType: E): void;

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
export function emitMiniAppsEvent<E extends EventsWithRequiredPayload>(
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
  eventData: E extends EventsWithoutPayload
    ? never
    : E extends EventsWithRequiredPayload
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
