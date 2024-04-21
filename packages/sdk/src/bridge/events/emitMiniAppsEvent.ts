/**
 * Emits event sent from Telegram native application like it was sent in
 * default web environment between 2 iframes. It dispatches new MessageEvent
 * and expects it to be handled via `window.addEventListener('message', ...)`
 * as developer would do it to handle messages sent from the parent iframe.
 * @param eventType - event name.
 * @param eventData - event payload.
 */
export function emitMiniAppsEvent(eventType: string, eventData: unknown): void {
  window.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({ eventType, eventData }),
    // We specify window.parent to imitate the case, the parent iframe sent us this event.
    source: window.parent,
  }));
}
