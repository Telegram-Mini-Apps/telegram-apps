import { describe, vi, it, expect, afterEach } from 'vitest';

import { Computed } from '@/signals/Computed/Computed.js';
import { Signal } from '@/signals/Signal/Signal.js';

afterEach(() => {
  vi.clearAllMocks();
});

describe('subscribe', () => {
  it('should call passed function if signal was changed directly', () => {
    const computed = new Computed(() => 1);
    const fn = vi.fn();
    computed.subscribe(fn);
    computed.set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
  });

  it('should call passed function if signal deps changed', () => {
    const signal = new Signal(1);
    const computed = new Computed(() => {
      return signal.get();
    });
    const fn = vi.fn();
    computed.subscribe(fn);
    signal.set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
  });

  it('should not call function if set value is the same', () => {
    const computed = new Computed(() => 1);
    const fn = vi.fn();
    computed.subscribe(fn);
    computed.set(1);
    expect(fn).toBeCalledTimes(0);
  });
});
