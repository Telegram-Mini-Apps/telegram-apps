import { describe, vi, expect, it, afterEach } from 'vitest';
import { mockPerformanceGetEntriesByType } from 'test-utils';

import { computePageReload } from '../src/computePageReload.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('computePageReload', () => {
  it('should return null if window.performance does not have any navigation entries', () => {
    mockPerformanceGetEntriesByType();
    expect(computePageReload()).toBeNull();
  });

  it('should return true if first navigation entry has type "reload"', () => {
    mockPerformanceGetEntriesByType([{ type: 'reload' }] as any);
    expect(computePageReload()).toBe(true);
  });

  it('should return false if first navigation entry has type different from "reload"', () => {
    mockPerformanceGetEntriesByType([{ type: 'navigation' }] as any);
    expect(computePageReload()).toBe(false);

    mockPerformanceGetEntriesByType([{ type: 'something else' }] as any);
    expect(computePageReload()).toBe(false);
  });
});
