import { vi, expect, it, beforeAll, afterAll } from 'vitest';
import { sleep } from '@/timeout/sleep.js';

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

it('should resolve promise after specified timeout', () => {
  let done = false;
  sleep(1000).then(() => done = true);
  vi.advanceTimersByTime(999);
  expect(done).toBe(false);

  Promise
    .resolve()
    .then(() => vi.advanceTimersByTime(2))
    .then(() => expect(done).toBe(true))
    .finally(() => vi.advanceTimersToNextTimer())
});
