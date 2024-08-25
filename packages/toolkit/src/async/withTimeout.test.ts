import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { withTimeout } from './withTimeout.js';

describe('withTimeout', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should throw an error in case timeout reached', async () => {
    const promise = withTimeout(() => new Promise((res) => {
      setTimeout(res, 500);
    }), 100);

    vi.advanceTimersByTime(500);
    await expect(promise).rejects.toMatchObject({
      type: 'ERR_TIMED_OUT',
      message: 'Timeout reached: 100ms',
    });
  }, 1000);

  it('should return resolved value by wrapped function', async () => {
    const promise = withTimeout(() => new Promise((res) => {
      res('I am fine');
    }), 100);

    await expect(promise).resolves.toBe('I am fine');
  }, 1000);
});


