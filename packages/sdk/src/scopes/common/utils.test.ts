import { describe, vi, expect, it, afterEach, beforeEach } from 'vitest';

import { resetPackageState } from '@test-utils/reset.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';

import { $postEvent } from '@/scopes/globals/globals.js';

import { readTextFromClipboard } from './utils.js';

beforeEach(() => {
  $postEvent.set(() => null);
});

afterEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
});

describe('readTextFromClipboard', () => {
  it('should call "web_app_read_text_from_clipboard" method and receive "clipboard_text_received" event', async () => {
    const promise = readTextFromClipboard();
    dispatchWindowMessageEvent('clipboard_text_received', {
      req_id: 1,
      data: 'Some text',
    });

    await expect(promise).resolves.toBe('Some text');
  });
});
