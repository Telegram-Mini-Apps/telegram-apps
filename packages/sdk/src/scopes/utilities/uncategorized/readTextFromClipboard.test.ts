import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchMiniAppsEvent } from 'test-utils';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setInitialized } from '@test-utils/setInitialized.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { $version } from '@/scopes/globals.js';

import { readTextFromClipboard } from './readTextFromClipboard.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setInitialized();
  mockMiniAppsEnv();
}

describe.each([
  ['readTextFromClipboard', readTextFromClipboard],
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
      setInitialized();
      expect(fn).not.toThrow(err);
    });

    describe('package initialized', () => {
      beforeEach(setInitialized);

      it('should throw ERR_NOT_SUPPORTED if Mini Apps version is less than 6.4', () => {
        $version.set('6.3');
        expect(fn).toThrow(
          new TypedError(
            'ERR_NOT_SUPPORTED',
            `Unable to call the ${name}() function: it is unsupported in Mini Apps version 6.3`,
          ),
        );
        $version.set('6.4');
        expect(fn).not.toThrow(
          new TypedError(
            'ERR_NOT_SUPPORTED',
            `Unable to call the ${name}() function: it is unsupported in Mini Apps version 6.4`,
          ),
        );
      });

      describe('package initialized', () => {
        beforeEach(setInitialized);

        describe('Mini Apps version is 6.4', () => {
          beforeEach(() => {
            $version.set('6.4');
          });

          it('should not throw', () => {
            expect(fn).not.toThrow();
          });
        });
      });
    });
  });

  describe('isSupported', () => {
    it('should return true only if Mini Apps version is 6.4 or higher. False otherwise', () => {
      $version.set('6.3');
      expect(fn.isSupported()).toBe(false);
      $version.set('6.4');
      expect(fn.isSupported()).toBe(true);
    });
  });
});

describe('readTextFromClipboard', () => {
  beforeEach(setAvailable);

  it('should call "web_app_read_text_from_clipboard" method and receive "clipboard_text_received" event', async () => {
    const spy = mockPostEvent();
    const promise = readTextFromClipboard();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_read_text_from_clipboard', {
      req_id: expect.stringMatching(/\d+/),
    });

    dispatchMiniAppsEvent('clipboard_text_received', {
      req_id: (spy.mock.calls[0][1] as any).req_id,
      data: 'Some text',
    });

    await expect(promise).resolves.toBe('Some text');
  });

  describe('isSupported', () => {
    it('should return false if version is less than 6.4', () => {
      $version.set('6.3');
      expect(readTextFromClipboard.isSupported()).toBe(false);

      $version.set('6.4');
      expect(readTextFromClipboard.isSupported()).toBe(true);
    });
  });
});
