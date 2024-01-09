import { afterAll, beforeAll, expect, it, vi } from 'vitest';

import { TimeoutError, withTimeout } from '../index';

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
  expect(promise).rejects.toStrictEqual(new TimeoutError(100));
}, 1000);

it('should return resolved value by wrapped function', () => {
  const promise = withTimeout(() => new Promise((res) => {
    res('I am fine');
  }), 100);

  expect(promise).resolves.toBe('I am fine');
}, 1000);
