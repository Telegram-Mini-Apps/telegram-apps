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