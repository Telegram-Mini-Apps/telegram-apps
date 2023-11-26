import { afterEach, expect, it, vi } from 'vitest';
import {
  mockPerformanceGetEntriesByType,
  mockWindowLocationHash,
  toSearchParams,
} from 'test-utils';

import { retrieveCurrent } from '../src/retrieveCurrent.js';

afterEach(() => {
  vi.restoreAllMocks();
});

it('should return launch parameters from performance in case they exist', () => {
  mockPerformanceGetEntriesByType([{
    name: `#${toSearchParams({
      tgWebAppThemeParams: {},
      tgWebAppVersion: '6.9',
      tgWebAppPlatform: 'web',
    })}`,
  }] as any);

  expect(retrieveCurrent()).toStrictEqual({
    themeParams: {},
    version: '6.9',
    platform: 'web',
  });
});

it('should return launch parameters from location in case they exist', () => {
  mockWindowLocationHash(
    `#${toSearchParams({
      tgWebAppThemeParams: {},
      tgWebAppVersion: '6.9',
      tgWebAppPlatform: 'web',
    })}`,
  );

  expect(retrieveCurrent()).toStrictEqual({
    themeParams: {},
    version: '6.9',
    platform: 'web',
  });
});

it('should return null in case both location and performance do not have launch parameters', () => {
  expect(retrieveCurrent()).toBeNull();
});
