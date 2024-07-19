import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FnToSpy } from '@test-utils/types.js';

import { registerGet as registerGetFn } from '@/reactivity/context.js';
import { signal } from '@/reactivity/signal.js';

vi.mock('@/reactivity/context.js', () => ({
  registerGet: vi.fn(),
}));

const registerGet =
  registerGetFn as unknown as FnToSpy<typeof registerGetFn>;

afterEach(() => {
  vi.clearAllMocks();
});

describe('get', () => {
  it('should return signal value', () => {
    const [get] = signal(123321);
    expect(get()).toBe(123321);
  });

  it('should call registerGet function with track function when called', () => {
    const [get, , track] = signal(1);
    get();
    expect(registerGet).toHaveBeenCalledTimes(1);
    expect(registerGet).toHaveBeenCalledWith(track);
  });
});

describe('set', () => {
  it('should update signal value', () => {
    const [get, set] = signal(1);
    expect(get()).toBe(1);
    set(2);
    expect(get()).toBe(2);
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
