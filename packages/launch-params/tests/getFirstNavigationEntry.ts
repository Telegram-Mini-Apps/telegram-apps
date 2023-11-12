import { describe, vi, expect, it, afterEach } from 'vitest';
import { mockPerformanceGetEntriesByType } from 'test-utils';

import { getFirstNavigationEntry } from '../src/getFirstNavigationEntry.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getFirstNavigationEntry', () => {
  it('should return null if window.performance does not have any navigation entries', () => {
    mockPerformanceGetEntriesByType();
    expect(getFirstNavigationEntry()).toBeNull();
  });

  it('should return the first navigation entry in case, window.performance has some', () => {
    const entry = {};
    mockPerformanceGetEntriesByType([entry] as any);
    expect(getFirstNavigationEntry()).toBe(entry);
  });
});
