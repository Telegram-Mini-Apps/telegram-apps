import { afterEach, describe, expect, it, vi } from 'vitest';

import { signal } from './signal.js';

afterEach(() => {
  vi.clearAllMocks();
});

describe('get', () => {
  it('should return signal value', () => {
    const s = signal(123321);
    expect(s()).toBe(123321);
  });
});

describe('set', () => {
  it('should update signal value', () => {
    const s = signal(1);
    expect(s()).toBe(1);
    s.set(2);
    expect(s()).toBe(2);
  });
});

describe('sub', () => {
  it('should call passed function if signal was changed', () => {
    const s = signal(1);
    const fn = vi.fn();
    s.sub(fn);
    s.set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
  });

  it('should not call function if set value is the same', () => {
    const s = signal(1);
    const fn = vi.fn();
    s.sub(fn);
    s.set(1);
    expect(fn).toBeCalledTimes(0);
  });
});

// todo: reset

describe('unsub', () => {
  it('should not call passed function if signal was changed', () => {
    const s = signal(1);
    const fn = vi.fn();
    s.sub(fn);
    s.set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
    fn.mockClear();

    s.unsub(fn);
    s.set(3);
    expect(fn).toBeCalledTimes(0);
  });
});

describe('unsubAll', () => {
  it('should remove all listeners', () => {
    const s = signal(1);
    const fn = vi.fn();
    const fn2 = vi.fn();
    s.sub(fn);
    s.sub(fn2);
    s.set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn2).toBeCalledTimes(1);
    fn.mockClear();
    fn2.mockClear();

    s.unsubAll();
    s.set(3);
    expect(fn).toBeCalledTimes(0);
    expect(fn2).toBeCalledTimes(0);
  });
});
