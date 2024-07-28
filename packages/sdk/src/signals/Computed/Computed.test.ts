import { describe, vi, it, expect, afterEach } from 'vitest';

import { Computed } from './Computed.js';
import { Signal } from '../Signal/Signal.js';

afterEach(() => {
  vi.clearAllMocks();
});

describe('sub', () => {
  it('should call passed function if signal deps changed', () => {
    const signal = new Signal(1);
    const computed = new Computed(() => {
      return signal.get();
    });
    expect(computed.get()).toBe(1);
    const fn = vi.fn();
    computed.sub(fn);
    signal.set(2);
    expect(computed.get()).toBe(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
  });
});
