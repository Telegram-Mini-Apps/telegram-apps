import { vi } from 'vitest';

import { formatImplementation, type MockImplementation } from './utils';

export type Wnd = Window & typeof globalThis;

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
