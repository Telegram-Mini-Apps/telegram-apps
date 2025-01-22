import { describe, vi, expect, it, beforeEach } from 'vitest';

import {
  mockPostEvent,
  resetPackageState,
  mockMiniAppsEnv,
  setMaxVersion,
} from '@test-utils/utils.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { InvalidArgumentsError } from '@/errors.js';

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

  it('should throw InvalidArgumentsError if passed invalid URL', () => {
    expect(() => openLink('invalid')).toThrow(
      new InvalidArgumentsError('"invalid" is invalid URL'),
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
