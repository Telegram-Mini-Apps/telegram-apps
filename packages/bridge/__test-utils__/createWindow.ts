import { vi, type SpyInstance } from 'vitest';
import { createDomEmitter } from './createDomEmitter';

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
    ...createDomEmitter(),
    ...(env === 'iframe' ? {
      top: 1,
      self: 2,
      parent: { postMessage: postMessageSpy },
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
