import { afterEach, expect, it, vi } from 'vitest';
import { mockWindowLocationHash, toSearchParams } from 'test-utils';

import { retrieveFromLocation } from '../src/index.js';

afterEach(() => {
  vi.restoreAllMocks();
});

it('should return launch parameters from window.location.hash in case they exist', () => {
  mockWindowLocationHash(
    `#${toSearchParams({
      tgWebAppThemeParams: {},
      tgWebAppVersion: '6.9',
      tgWebAppPlatform: 'web',
    })}`,
  );

  expect(retrieveFromLocation()).toStrictEqual({
    themeParams: {},
    version: '6.9',
    platform: 'web',
  });
});

it('should throw in case window.location.hash do not have valid launch parameters', () => {
  expect(() => retrieveFromLocation()).toThrow();
});
