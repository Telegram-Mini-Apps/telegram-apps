import { vi } from 'vitest';

/**
 * Mocks sessionStorage.setItem.
 * @param impl - method implementation.
 */
export function mockSessionStorageSetItem(
  impl?: (k: string, v: string) => void
) {
  return vi
    .spyOn(sessionStorage, 'setItem')
    .mockImplementation(impl || (() => null));
}