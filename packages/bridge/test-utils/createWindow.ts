import { type SpyInstance, vi } from 'vitest';
import { mockWindow, type Wnd } from 'test-utils';

import { createDomEmitter } from './createDomEmitter.js';

type CreateWindowOptions = Partial<Wnd & { env: 'iframe' }>;

export type WindowSpy = SpyInstance<[], Window & typeof globalThis>;

/**
 * Mocks window and returns created spy.
 * @param options - additional options.
 */
export function createWindow({ env, ...rest }: CreateWindowOptions = {}): WindowSpy {
  return mockWindow({
    // We need this property to correctly re-emit received event from Telegram.
    parent: { postMessage: vi.fn() },
    ...createDomEmitter(),
    ...(env === 'iframe' ? { top: 1, self: 2 } : {}),
    ...rest,
  } as Wnd);
}

// export function mockWindow(
//   options: MockWindowOptions = {},
// ): vi.SpyInstance<Window & typeof globalThis> {
//   const { innerWidth, innerHeight, env } = options;
//   const spy = vi.spyOn(window, 'window', 'get');
//   const postMessageSpy = vi.fn();
//
//   beforeEach(() => {
//     const wnd = {
//       innerHeight,
//       innerWidth,
//       ...createDomEmitter(),
//       ...(env === 'iframe' ? {
//         top: 1,
//         self: 2,
//         parent: { postMessage: postMessageSpy },
//       } : {}),
//     };
//     spy.mockImplementation(() => wnd as any);
//   });
//
//   afterEach(() => {
//     postMessageSpy.mockReset();
//     spy.mockReset();
//   });
//
//   return spy;
// }
