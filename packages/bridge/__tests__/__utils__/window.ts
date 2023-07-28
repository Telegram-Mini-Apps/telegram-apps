import { domEmitter } from './domEmitter.js';

interface MockWindowOptions {
  innerWidth?: number;
  innerHeight?: number;
}

export function mockWindow(
  options: MockWindowOptions = {},
): jest.SpyInstance<Window & typeof globalThis> {
  const spy = jest.spyOn(window, 'window', 'get');

  beforeEach(() => {
    const wnd = {
      ...domEmitter(),
      ...options,
    };
    spy.mockImplementation(() => wnd as any);
  });

  afterEach(() => {
    spy.mockReset();
  });

  return spy;
}

/**
 * Uses window.dispatchEvent function with specified message event
 * to dispatch event to imitate its creation by Telegram.
 * @param eventType - event name.
 * @param eventData - event payload.
 */
export function dispatchWindowEvent(eventType: string, eventData?: unknown): void {
  window.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({ eventType, eventData }),
  }));
}
