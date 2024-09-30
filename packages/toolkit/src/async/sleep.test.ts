import { vi, expect, it, beforeAll, afterAll } from 'vitest';

import { sleep } from './sleep.js';

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

it('should resolve promise after specified timeout', async () => {
  let done = false;
  const promise = sleep(1000).then(() => done = true);
  vi.advanceTimersByTime(999);
  expect(done).toBe(false);
  vi.advanceTimersByTime(2);
  await promise;
  expect(done).toBe(true);
});
