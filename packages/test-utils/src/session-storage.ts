import { vi } from 'vitest';

import { formatImplementation, type MockImplementation } from './utils';

/**
 * Mocks sessionStorage.getItem.
 * @param impl - method implementation.
 */
export function mockSessionStorageGetItem(
  impl: MockImplementation<string | null> = null,
) {
  return vi
    .spyOn(sessionStorage, 'getItem')
    .mockImplementation(formatImplementation(impl));
}

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
