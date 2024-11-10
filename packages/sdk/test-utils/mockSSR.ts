import { vi } from 'vitest';

/**
 * Mocks the current environment making the code determining it as
 * the server environment.
 */
export function mockSSR() {
  return vi
    .spyOn(global, 'window', 'get')
    .mockImplementation(() => undefined as any);
}