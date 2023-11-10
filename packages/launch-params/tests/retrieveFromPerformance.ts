import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockPerformanceGetEntriesByType, toSearchParams } from 'test-utils';

import { retrieveFromPerformance } from '../src/index.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('retrieveFromPerformance', () => {
  it('should throw in case window.performance does not have navigation entry', () => {
    mockPerformanceGetEntriesByType();
    expect(() => retrieveFromPerformance()).toThrow('Unable to get first navigation entry.');
  });

  it('should throw in case first navigation entry does not contain hash part', () => {
    mockPerformanceGetEntriesByType([{ name: 'https://mydomain.com' }] as any);
    expect(() => retrieveFromPerformance()).toThrow('First navigation entry does not contain hash part.');
  });

  it('should throw in case first navigation entry contains invalid data in hash part', () => {
    mockPerformanceGetEntriesByType([{ name: 'https://mydomain.com#' }] as any);
    expect(() => retrieveFromPerformance()).toThrow('Unable to parse value');
  });

  it('should return launch parameters from the first navigation entry', () => {
    mockPerformanceGetEntriesByType([{
      name: `#${toSearchParams({
        tgWebAppThemeParams: {},
        tgWebAppVersion: '6.9',
        tgWebAppPlatform: 'web',
      })}`,
    }] as any);
    expect(retrieveFromPerformance()).toStrictEqual({
      themeParams: {},
      version: '6.9',
      platform: 'web',
    });
  });
});
