import { describe, vi, it, expect, afterEach } from 'vitest';

import { computed } from './computed.js';
import { signal } from '../signal/signal.js';

afterEach(() => {
  vi.clearAllMocks();
});

describe('sub', () => {
  it('should call passed function if signal deps changed', () => {
    const [getSignal, setSignal] = signal(1);
    const [get, sub] = computed(() => {
      return getSignal();
    });
    expect(get()).toBe(1);
    const fn = vi.fn();
    sub(fn);
    setSignal(2);
    expect(get()).toBe(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
  });
});
