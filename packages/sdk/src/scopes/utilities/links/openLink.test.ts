import { describe, vi, expect, it, beforeEach } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';

import { openLink } from './openLink.js';

beforeEach(() => {
  resetPackageState();
  mockPostEvent();
  vi.restoreAllMocks();
});

function setAvailable() {
  mockMiniAppsEnv();
  setMaxVersion();
}

describe.each([
  ['openLink', openLink],
] as const)('%s', (name, fn) => {
  it('should throw ERR_UNKNOWN_ENV if not in Mini Apps', () => {
    const err = new TypedError(
      'ERR_UNKNOWN_ENV',
      `Unable to call the ${name}() function: it can't be called outside Mini Apps`,
    );
    expect(fn).toThrow(err);
    mockMiniAppsEnv();
    expect(fn).not.toThrow(err);
  });

  describe('mini apps env', () => {
    beforeEach(mockMiniAppsEnv);

    it('should throw ERR_UNKNOWN_ENV if called on the server', () => {
      mockSSR();
      expect(fn).toThrow(
        new TypedError(
          'ERR_UNKNOWN_ENV',
          `Unable to call the ${name}() function: it can't be called outside Mini Apps`,
        ),
      );
    });

    it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
      const err = new TypedError(
        'ERR_NOT_INITIALIZED',
        `Unable to call the ${name}() function: the SDK was not initialized. Use the SDK init() function`,
      );
      expect(fn).toThrow(err);
      setMaxVersion();
      expect(fn).not.toThrow(err);
    });
  });
});

describe('openLink', () => {
  beforeEach(setAvailable);

  it('should throw ERR_INVALID_URL if passed invalid URL', () => {
    expect(() => openLink('invalid')).toThrow(
      new TypedError('ERR_INVALID_URL', '"invalid" is invalid URL'),
    );
  });

  it('should call "web_app_open_link" with formatted URL and passed options', () => {
    const spy = mockPostEvent();
    openLink('https://ya.ru', {
      tryBrowser: 'tor',
      tryInstantView: true,
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_open_link', {
      url: 'https://ya.ru/',
      try_browser: 'tor',
      try_instant_view: true,
    });
  });
});
