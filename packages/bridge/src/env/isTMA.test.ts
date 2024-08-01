import { afterEach, expect, it, vi } from 'vitest';

import { request as requestFn } from '@/bridge/request.js';
import { isTMA } from '@/env/isTMA.js';
import { createWindow } from '@test-utils/createWindow.js';

const request = vi.mocked(requestFn);

vi.mock('@/bridge/request.js', () => ({
  request: vi.fn(),
}));

afterEach(() => {
  vi.resetAllMocks();
});

it('should return true if current window contains TelegramWebviewProxy property', async () => {
  createWindow({
    TelegramWebviewProxy: {
      postEvent: 123,
    },
  } as any);
  await expect(isTMA()).resolves.toBe(true);
});

it('should return promise with true value resolved, if requesting theme parameters was successful', async () => {
  createWindow();
  request.mockImplementationOnce(() => Promise.resolve({}));
  await expect(isTMA()).resolves.toBe(true);
});

it('should return promise with false value resolved, if requesting theme parameters was unsuccessful', async () => {
  createWindow();
  request.mockImplementationOnce(() => Promise.reject(new Error('Timed out.')));
  await expect(isTMA()).resolves.toBe(false);
});
