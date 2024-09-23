import { vi } from 'vitest';
import type { PostEventFn } from '@telegram-apps/bridge';

import { $postEvent } from '@/scopes/globals/globals.js';

export function mockPostEvent(postEvent: PostEventFn = () => null) {
  const fn = vi.fn(postEvent);
  $postEvent.set(fn as any);
  return fn;
}