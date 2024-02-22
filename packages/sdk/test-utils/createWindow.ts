import { type SpyInstance, vi } from 'vitest';

import { createDomEmitter } from './createDomEmitter.js';

interface CreateWindowOptions {
  innerWidth?: number;
  innerHeight?: number;
  env?: 'iframe';
}

export type WindowSpy = SpyInstance<[], Window & typeof globalThis>;

/**
 * Mocks window and returns created spy.
 * @param options - additional options.
 */
export function createWindow(options: CreateWindowOptions = {}): WindowSpy {
  const { innerWidth, innerHeight, env } = options;
  const postMessageSpy = vi.fn();
  const wnd = {
    innerHeight,
    innerWidth,
    // We need this property to correctly re-emit received event from Telegram.
    parent: { postMessage: postMessageSpy },
    ...createDomEmitter(),
    ...(env === 'iframe' ? {
      top: 1,
      self: 2,
    } : {}),
  };

  return vi.spyOn(window, 'window', 'get').mockImplementation(() => wnd as any);
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
