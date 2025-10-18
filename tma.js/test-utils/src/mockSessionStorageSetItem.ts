import { vi } from 'vitest';

/**
 * Mocks sessionStorage.setItem.
 * @param impl - method implementation.
 */
export function mockSessionStorageSetItem(
  impl?: (k: string, v: string) => void,
) {
  return vi
    .spyOn(window.sessionStorage, 'setItem')
    .mockImplementation(impl || (() => null));
}
