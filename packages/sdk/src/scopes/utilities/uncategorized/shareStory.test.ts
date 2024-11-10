import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
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
