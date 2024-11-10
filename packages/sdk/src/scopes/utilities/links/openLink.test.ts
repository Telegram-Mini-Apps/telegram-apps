import { describe, vi, expect, it, beforeEach } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';

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

testSafety(openLink, 'openLink', {});

describe('is available', () => {
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
