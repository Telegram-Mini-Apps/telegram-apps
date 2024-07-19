import { describe, vi, it, expect, afterEach } from 'vitest';

import { computed } from '@/reactivity/computed.js';
import { registerReactiveUnitUsage as registerReactiveUnitUsageFn } from '@/reactivity/context.js';
import type { FnToSpy } from '@test-utils/types.js';
import { signal } from '@/reactivity/signal.js';

vi.mock('@/reactivity/context.js', async () => {
  const { runInReactiveContext } = await vi.importActual('@/reactivity/context.js');

  return {
    runInReactiveContext,
    registerReactiveUnitUsage: vi.fn(),
  };
});

const registerReactiveUnitUsage =
  registerReactiveUnitUsageFn as unknown as FnToSpy<typeof registerReactiveUnitUsageFn>;

afterEach(() => {
  vi.clearAllMocks();
});

describe('get', () => {
  it('should return signal value', () => {
    const [get] = computed(() => 123321);
    expect(get()).toBe(123321);
  });

  it('should call registerReactiveUnitUsage function with track function when called', () => {
    const [get, track] = computed(() => 1);
    get();
    expect(registerReactiveUnitUsage).toHaveBeenCalledTimes(1);
    expect(registerReactiveUnitUsage).toHaveBeenCalledWith(track);
  });
});

describe('track', () => {
  it('should call passed function if signal was changed', () => {
    const [_, set, track] = signal(1);
    const fn = vi.fn();
    track(fn);
    set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
  });

  it('should not call function if set value is the same', () => {
    const [_, set, track] = signal(1);
    const fn = vi.fn();
    track(fn);
    set(1);
    expect(fn).toBeCalledTimes(0);
  });
});

describe('untrack', () => {
  it('should not call passed function if signal was changed', () => {
    const [_, set, track, untrack] = signal(1);
    const fn = vi.fn();
    track(fn);
    set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
    fn.mockClear();

    untrack(fn);
    set(3);
    expect(fn).toBeCalledTimes(0);
  });
});

describe('untrackAll', () => {
  it('should remove all listeners', () => {
    const [_, set, track, , untrackAll] = signal(1);
    const fn = vi.fn();
    const fn2 = vi.fn();
    track(fn);
    track(fn2);
    set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn2).toBeCalledTimes(1);
    fn.mockClear();
    fn2.mockClear();

    untrackAll();
    set(3);
    expect(fn).toBeCalledTimes(0);
    expect(fn2).toBeCalledTimes(0);
  });
});
