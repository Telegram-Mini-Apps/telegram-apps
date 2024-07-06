import { afterEach, expect, it, vi } from 'vitest';
import type { FnToSpy } from '@test-utils/types.js';

import { request as requestFn } from '@/bridge/request.js';
import { isTMA } from '@/env/isTMA.js';
import { createWindow } from '@test-utils/createWindow.js';

const request = requestFn as unknown as FnToSpy<typeof requestFn>;

vi.mock('@/bridge/request.js', async () => ({
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

it(
  'should return promise with true value resolved, if requesting theme parameters was successful',
  () => {
    createWindow();
    request.mockImplementationOnce(async () => ({}));
    expect(isTMA()).resolves.toBe(true);
  },
);

it(
  'should return promise with false value resolved, if requesting theme parameters was unsuccessful',
  () => {
    createWindow();
    request.mockImplementationOnce(async () => {
      throw new Error('Timed out.');
    });
    expect(isTMA()).resolves.toBe(false);
  },
);
