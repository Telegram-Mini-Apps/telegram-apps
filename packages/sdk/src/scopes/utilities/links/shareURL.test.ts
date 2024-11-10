import { describe, vi, expect, it, beforeEach } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';

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

describe.each([
  ['shareURL', shareURL],
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

describe('shareURL', () => {
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