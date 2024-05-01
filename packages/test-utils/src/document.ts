import { vi } from 'vitest';

import { formatImplementation, type MockImplementation } from './utils';

/**
 * Mocks document.
 * @param impl - window getter implementation.
 */
export function mockDocument(impl: MockImplementation<Document>) {
  return vi
    .spyOn(global, 'document', 'get')
    .mockImplementation(formatImplementation(impl));
}
