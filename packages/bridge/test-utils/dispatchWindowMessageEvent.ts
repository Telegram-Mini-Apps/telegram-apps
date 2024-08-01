/**
 * Uses window.dispatchEvent function with specified message event
 * to dispatch event to imitate its creation by Telegram.
 * @param eventType - event name.
 * @param eventData - event payload.
 */
export function dispatchWindowMessageEvent(eventType: string, eventData?: unknown): void {
  window.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({ eventType, eventData }),
    source: window.parent,
  }));
}
