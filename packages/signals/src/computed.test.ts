import { describe, vi, it, expect, afterEach } from 'vitest';

import { computed } from './computed.js';
import { signal } from './signal.js';

afterEach(() => {
  vi.clearAllMocks();
});

describe('sub', () => {
  it('should call passed function if signal deps changed', () => {
    const s = signal(100);
    const c = computed(() => {
      return s();
    });
    expect(c()).toBe(100);
    const fn = vi.fn();
    c.sub(fn);
    s.set(200);
    expect(c()).toBe(200);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(200, 100);
  });
});
