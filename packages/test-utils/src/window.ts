import { type MockInstance, vi } from 'vitest';

import { formatImplementation, type MockImplementation } from './utils';

export type Wnd = Window & typeof globalThis;
export type WindowSpy = MockInstance<[], Wnd>;

/**
 * Mocks window getter.
 * @param impl - window getter implementation.
 */
export function mockWindow(impl: MockImplementation<Wnd>) {
  return vi
    .spyOn(global, 'window', 'get')
    .mockImplementation(formatImplementation(impl));
}

/**
 * Mocks window.location.hash getter.
 * @param impl - hash getter implementation.
 */
export function mockWindowLocationHash(
  impl: MockImplementation<string> = '',
) {
  return vi
    .spyOn(window.location, 'hash', 'get')
    .mockImplementation(formatImplementation(impl));
}

/**
 * Uses window.dispatchEvent function with specified message event to dispatch event to imitate
 * its creation by Telegram.
 * @param eventType - event name.
 * @param eventData - event payload.
 */
export function dispatchMiniAppsEvent(eventType: string, eventData?: unknown): void {
  window.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({ eventType, eventData }),
    source: window.parent,
  }));
}

export interface DomEmitter {
  addEventListener(event: string, cb: (event: Event) => void): void;
  removeEventListener(event: string, cb: (event: Event) => void): void;
  dispatchEvent(event: Event): void;
}

/**
 * Removes simple emitter, which could be used in tests.
 */
export function createDomEmitter(): DomEmitter {
  const listeners: Record<string, ((...args: any) => any)[]> = {};

  return {
    addEventListener(event, cb) {
      if (listeners[event] === undefined) {
        listeners[event] = [];
      }
      listeners[event].push(cb);
    },
    removeEventListener(event, cb) {
      const eventListeners = listeners[event] || [];
      if (eventListeners.includes(cb)) {
        eventListeners.splice(eventListeners.indexOf(cb), 1);
      }
    },
    dispatchEvent(event): void {
      const cbs = listeners[event.type] || [];
      cbs.forEach((cb) => cb(event));
    },
  };
}

/**
 * Mocks window and returns created spy.
 * @param options - additional options.
 */
export function createWindow({ env, ...rest }: Partial<Wnd & { env: 'iframe' }> = {}): WindowSpy {
  return mockWindow({
    // We need this property to correctly re-emit received event from Telegram.
    parent: { postMessage: vi.fn() },
    ...createDomEmitter(),
    ...(env === 'iframe' ? { top: 1, self: 2 } : {}),
    ...rest,
  } as Wnd);
}
