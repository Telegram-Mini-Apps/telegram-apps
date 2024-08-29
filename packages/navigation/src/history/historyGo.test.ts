import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { historyGo } from './historyGo.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should return true if delta is 0', async () => {
  await expect(historyGo(0)).resolves.toBe(true);
});

it('should return true if "popstate" event was emitted during next 50ms', async () => {
  const promise = historyGo(10);
  vi.advanceTimersByTime(49);
  window.dispatchEvent(new PopStateEvent('popstate'));
  await expect(promise).resolves.toBe(true);
});

it('should return false if "popstate" event was not emitted for more than 50ms', async () => {
  const promise = historyGo(10);
  vi.advanceTimersByTime(50);
  window.dispatchEvent(new PopStateEvent('popstate'));
  await expect(promise).resolves.toBe(false);
});