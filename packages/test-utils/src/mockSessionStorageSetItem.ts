import { vi } from 'vitest';

/**
 * Mocks sessionStorage.setItem.
 * @param impl - method implementation.
 */
export function mockSessionStorageSetItem(impl?: () => void) {
  const spy = vi.spyOn(sessionStorage, 'setItem');
  if (impl) {
    spy.mockImplementation(impl);
  }

  return spy;
}