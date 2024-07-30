import { describe, vi, expect, it, afterEach, beforeEach } from 'vitest';

import { postEvent } from '@/globals/globals.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';

import { readTextFromClipboard } from './utils.js';
import { resetGlobals } from '@test-utils/resetGlobals.js';

beforeEach(() => {
  postEvent.set(() => null);
});

afterEach(() => {
  resetGlobals();
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
