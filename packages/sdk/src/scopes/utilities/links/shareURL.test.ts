import { describe, vi, expect, it, beforeEach } from 'vitest';

import {
  mockPostEvent,
  resetPackageState,
  mockMiniAppsEnv,
  setMaxVersion,
} from '@test-utils/utils.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';

import { shareURL } from './shareURL.js';

beforeEach(() => {
  resetPackageState();
  mockPostEvent();
  vi.restoreAllMocks();
});

function setAvailable() {
  mockMiniAppsEnv();
  setMaxVersion();
}

testSafety(shareURL, 'shareURL', {});

describe('is available', () => {
  beforeEach(setAvailable);

  it('should call "web_app_open_tg_link" with path_full = "share/url?url={url}&text={text}"', () => {
    const spy = mockPostEvent();

    shareURL('https://telegram.org');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_open_tg_link', {
      path_full: '/share/url?url=https%3A%2F%2Ftelegram.org&text=',
    });

    spy.mockClear();
    shareURL('https://telegram.org', 'Wow, cool messenger');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_open_tg_link', {
      path_full: '/share/url?url=https%3A%2F%2Ftelegram.org&text=Wow%2C%20cool%20messenger',
    });
  });
});