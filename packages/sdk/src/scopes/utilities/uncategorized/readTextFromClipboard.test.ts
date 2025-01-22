import { beforeEach, describe, expect, it, vi } from 'vitest';
import { emitEvent } from '@telegram-apps/bridge';

import {
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
  mockMiniAppsEnv,
} from '@test-utils/utils.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';

import { readTextFromClipboard } from './readTextFromClipboard.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
}

testSafety(readTextFromClipboard, 'readTextFromClipboard', {
  minVersion: '6.4',
});

describe('is available', () => {
  beforeEach(setAvailable);

  it('should call "web_app_read_text_from_clipboard" method and receive "clipboard_text_received" event', async () => {
    const spy = mockPostEvent();
    const promise = readTextFromClipboard();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_read_text_from_clipboard', {
      req_id: expect.stringMatching(/\d+/),
    });

    emitEvent('clipboard_text_received', {
      req_id: (spy.mock.calls[0][1] as any).req_id,
      data: 'Some text',
    });

    await expect(promise).resolves.toBe('Some text');
  });
});
