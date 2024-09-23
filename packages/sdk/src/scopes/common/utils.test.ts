import { describe, vi, expect, it, afterEach, beforeEach } from 'vitest';
import { dispatchMiniAppsEvent } from 'test-utils';

import { resetPackageState } from '@test-utils/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import { readTextFromClipboard } from './utils.js';

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
