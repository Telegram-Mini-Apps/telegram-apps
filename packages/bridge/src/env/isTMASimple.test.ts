import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockWindow } from 'test-utils';

import { isTMASimple } from './isTMASimple.js';

beforeEach(() => {
  mockWindow({
    location: {
      href: '',
    },
  } as any);
  mockSessionStorageGetItem();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('should return true if env contains launch params', () => {
  vi
    .spyOn(window.location, 'href', 'get')
    .mockImplementation(() => {
      return '/abc?tgWebAppStartParam=START#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D';
    });

  expect(isTMASimple()).toBe(true);
});

it('should return true if env doesnt contain launch params', () => {
  expect(isTMASimple()).toBe(false);
});