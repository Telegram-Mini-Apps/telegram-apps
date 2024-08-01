import { describe, vi, it, expect, afterEach } from 'vitest';

import { computed } from './computed.js';
import { signal } from './signal.js';

afterEach(() => {
  vi.clearAllMocks();
});

describe('sub', () => {
  it('should call passed function if signal deps changed', () => {
    const s = signal(1);
    const c = computed(() => {
      return s();
    });
    expect(c()).toBe(1);
    const fn = vi.fn();
    c.sub(fn);
    s.set(2);
    expect(c()).toBe(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
  });
});
