import { expect, it, vi } from 'vitest';
import type { FnToSpy } from '@test-utils/types.js';

import { request as requestFn } from '@/bridge/request.js';
import { isTMA } from '@/env/isTMA.js';

const request = requestFn as unknown as FnToSpy<typeof requestFn>;

vi.mock('@/bridge/request.js', async () => {
  return {
    request: vi.fn(),
  };
});

it('should return promise with true value resolved, if requesting theme parameters was successful', () => {
  request.mockImplementationOnce(async () => ({}));
  expect(isTMA()).resolves.toBe(true);
});

it('should return promise with false value resolved, if requesting theme parameters was unsuccessful', () => {
  request.mockImplementationOnce(async () => {
    throw new Error('Timed out.');
  });
  expect(isTMA()).resolves.toBe(false);
});
