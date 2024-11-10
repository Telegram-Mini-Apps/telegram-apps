import { describe, vi, expect, it, beforeEach } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { $version } from '@/scopes/globals.js';

import { openTelegramLink } from './openTelegramLink.js';

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
  ['openTelegramLink', openTelegramLink],
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

describe('openTelegramLink', () => {
  beforeEach(setAvailable);

  it('should throw ERR_INVALID_URL if URL does not match "https://t.me/.+"', () => {
    [
      'http://t.me/abc',
      'https://t.me/',
      'https://ya.ru',
    ].forEach(url => {
      expect(() => openTelegramLink(url)).toThrow(
        new TypedError('ERR_INVALID_URL', `"${url}" is invalid URL`),
      );
    });
  });

  it('should change window.location.href, if "web_app_open_tg_link" is not supported', () => {
    $version.set('6.0');
    const spy = vi.spyOn(window.location, 'href', 'set');
    openTelegramLink('https://t.me/share/url?url=text');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('https://t.me/share/url?url=text');
  });

  it('should call "web_app_open_tg_link" with { path_full: string }, where path_full is a combination of pathname and search', () => {
    const spy = mockPostEvent();
    openTelegramLink('https://t.me/share/url?url=text');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_open_tg_link', {
      path_full: '/share/url?url=text',
    });
  });
});
