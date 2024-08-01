import { vi } from 'vitest';
import { postEvent } from '@/scopes/globals/globals.js';

export function mockPostEvent() {
  const fn = vi.fn(() => null);
  postEvent.set(fn);
  return fn;
}