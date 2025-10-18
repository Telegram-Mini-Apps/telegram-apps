import { vi } from 'vitest';

import { formatImplementation, type MockImplementation } from './formatImplementation';

/**
 * Mocks sessionStorage.getItem.
 * @param impl - method implementation.
 */
export function mockSessionStorageGetItem(
  impl: MockImplementation<string | null, [string]> = null,
) {
  return vi
    .spyOn(Storage.prototype, 'getItem')
    .mockImplementation(formatImplementation(impl));
}
