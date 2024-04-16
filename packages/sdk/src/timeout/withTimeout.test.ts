import { createError } from '@/errors/createError.js';
import { ERROR_TIMED_OUT } from '@/errors/errors.js';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';

import { withTimeout } from './withTimeout.js';

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

it('should throw an error in case timeout reached', () => {
  const promise = withTimeout(() => new Promise((res) => {
    setTimeout(res, 500);
  }), 100);

  Promise.resolve().then(() => vi.advanceTimersByTime(500));
  expect(promise).rejects.toStrictEqual(createError(ERROR_TIMED_OUT, 'Timeout reached: 100ms'));
}, 1000);

it('should return resolved value by wrapped function', () => {
  const promise = withTimeout(() => new Promise((res) => {
    res('I am fine');
  }), 100);

  expect(promise).resolves.toBe('I am fine');
}, 1000);
