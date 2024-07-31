import { vi } from 'vitest';

import { formatImplementation, type MockImplementation } from './utils';

/**
 * Mocks performance.getEntriesByType.
 * @param impl - method implementation.
 */
export function mockPerformanceGetEntriesByType(
  impl: MockImplementation<PerformanceEntry[]> = [],
) {
  return vi
    .spyOn(performance, 'getEntriesByType')
    .mockImplementation(formatImplementation(impl));
}

export function mockPageReload() {
  return mockPerformanceGetEntriesByType([{ type: 'reload' }] as any);
}