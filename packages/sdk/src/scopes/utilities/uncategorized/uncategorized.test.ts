import { describe, vi, expect, it, afterEach, beforeEach } from 'vitest';
import { dispatchMiniAppsEvent } from 'test-utils';

import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import { readTextFromClipboard, shareStory } from './uncategorized.js';

beforeEach(() => {
  mockPostEvent();
});

afterEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
});

describe('readTextFromClipboard', () => {
  it('should call "web_app_read_text_from_clipboard" method and receive "clipboard_text_received" event', async () => {
    const promise = readTextFromClipboard();
    dispatchMiniAppsEvent('clipboard_text_received', {
      req_id: 1,
      data: 'Some text',
    });

    await expect(promise).resolves.toBe('Some text');
  });
});

describe('shareStory', () => {
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
});

