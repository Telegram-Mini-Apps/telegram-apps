import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchMiniAppsEvent } from 'test-utils';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
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
})

describe('is available', () => {
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
});
