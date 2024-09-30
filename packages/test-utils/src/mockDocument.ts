import { vi } from 'vitest';

import { formatImplementation, type MockImplementation } from './formatImplementation';

/**
 * Mocks document.
 * @param impl - window getter implementation.
 */
export function mockDocument(impl: MockImplementation<Document>) {
  return vi
    .spyOn(global, 'document', 'get')
    .mockImplementation(formatImplementation(impl));
}
