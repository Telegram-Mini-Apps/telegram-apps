import { describe, vi, expect, it, beforeEach } from 'vitest';

import {
  mockPostEvent,
  resetPackageState,
  mockMiniAppsEnv,
  setMaxVersion,
  setVersion,
} from '@test-utils/utils.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { InvalidArgumentsError } from '@/errors.js';

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

testSafety(openTelegramLink, 'openTelegramLink', {});

describe('is available', () => {
  beforeEach(setAvailable);

  it('should throw ERR_INVALID_URL if URL does not match "https://t.me/.+"', () => {
    [
      'http://t.me/abc',
      'https://t.me/',
      'https://ya.ru',
    ].forEach(url => {
      expect(() => openTelegramLink(url)).toThrow(
        new InvalidArgumentsError(`"${url}" is invalid URL`),
      );
    });
  });

  it('should change window.location.href, if "web_app_open_tg_link" is not supported', () => {
    setVersion('6.0');
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
