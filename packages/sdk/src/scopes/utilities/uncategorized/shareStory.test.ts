import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
  mockMiniAppsEnv,
} from '@test-utils/utils.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';

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

testSafety(shareStory, 'shareStory', {
  minVersion: '7.8',
});

describe('is available', () => {
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
});
