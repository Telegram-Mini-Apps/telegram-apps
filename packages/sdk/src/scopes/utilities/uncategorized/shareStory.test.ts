import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { $version } from '@/scopes/globals.js';

import { shareStory } from './shareStory.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
}

describe.each([
  ['shareStory', shareStory],
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

    describe('package initialized', () => {
      beforeEach(setMaxVersion);

      it('should throw ERR_NOT_SUPPORTED if Mini Apps version is less than 7.8', () => {
        $version.set('7.7');
        expect(fn).toThrow(
          new TypedError(
            'ERR_NOT_SUPPORTED',
            `Unable to call the ${name}() function: it is unsupported in Mini Apps version 7.7`,
          ),
        );
        $version.set('7.8');
        expect(fn).not.toThrow(
          new TypedError(
            'ERR_NOT_SUPPORTED',
            `Unable to call the ${name}() function: it is unsupported in Mini Apps version 7.8`,
          ),
        );
      });

      describe('package initialized', () => {
        beforeEach(setMaxVersion);

        describe('Mini Apps version is 7.8', () => {
          beforeEach(() => {
            $version.set('7.8');
          });

          it('should not throw', () => {
            expect(fn).not.toThrow();
          });
        });
      });
    });
  });

  describe('isSupported', () => {
    it('should return true only if Mini Apps version is 7.8 or higher. False otherwise', () => {
      $version.set('7.7');
      expect(fn.isSupported()).toBe(false);
      $version.set('7.8');
      expect(fn.isSupported()).toBe(true);
    });
  });
});

describe('shareStory', () => {
  beforeEach(setAvailable);

  it('should call "web_app_share_to_story" method with parameters', () => {
    const postEvent = mockPostEvent();
    shareStory('https://t.me/media.png', {
      text: 'Story text',
      widgetLink: {
        url: 'https://t.me/widget-url.png',
        name: 'Widget Text',
      },
    });
    expect(postEvent).toHaveBeenCalledOnce();
    expect(postEvent).toHaveBeenCalledWith('web_app_share_to_story', {
      media_url: 'https://t.me/media.png',
      text: 'Story text',
      widget_link: {
        url: 'https://t.me/widget-url.png',
        name: 'Widget Text',
      },
    });
  });

  describe('isSupported', () => {
    it('should return false if version is less than 7.8. True otherwise', () => {
      $version.set('7.7');
      expect(shareStory.isSupported()).toBe(false);

      $version.set('7.8');
      expect(shareStory.isSupported()).toBe(true);
    });
  });
});
