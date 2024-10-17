import { describe, vi, expect, it, beforeEach } from 'vitest';
import { dispatchMiniAppsEvent } from 'test-utils';
import { TypedError } from '@telegram-apps/bridge';

import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { $version } from '@/scopes/globals.js';

import { readTextFromClipboard, shareStory } from './uncategorized.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe('readTextFromClipboard', () => {
  it('should throw if version is less than 6.4', () => {
    $version.set('6.3');
    expect(readTextFromClipboard).toThrow(new TypedError('ERR_NOT_SUPPORTED'));

    $version.set('6.4');
    expect(readTextFromClipboard).not.toThrow();
  });

  beforeEach(() => {
    $version.set('10');
  });

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
    it('should return false if version is less than 6.4. True otherwise', () => {
      $version.set('6.3');
      expect(readTextFromClipboard.isSupported()).toBe(false);

      $version.set('6.4');
      expect(readTextFromClipboard.isSupported()).toBe(true);
    });
  });
});

describe('shareStory', () => {
  it('should throw if version is less than 7.8', () => {
    $version.set('7.7');
    expect(() => shareStory('')).toThrow(new TypedError('ERR_NOT_SUPPORTED'));

    $version.set('7.8');
    expect(() => shareStory('')).not.toThrow();
  });

  beforeEach(() => {
    $version.set('10');
  });

  it('should call "web_app_share_to_story" method with parameters', () => {
    const postEvent = vi.fn();
    shareStory('https://t.me/media.png', {
      postEvent,
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

