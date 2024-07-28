import { afterEach, describe, expect, it, vi } from 'vitest';

import { Signal } from './Signal.js';

afterEach(() => {
  vi.clearAllMocks();
});

describe('get', () => {
  it('should return signal value', () => {
    const signal = new Signal(123321);
    expect(signal.get()).toBe(123321);
  });
});

describe('set', () => {
  it('should update signal value', () => {
    const signal = new Signal(1);
    expect(signal.get()).toBe(1);
    signal.set(2);
    expect(signal.get()).toBe(2);
  });
});

describe('sub', () => {
  it('should call passed function if signal was changed', () => {
    const signal = new Signal(1);
    const fn = vi.fn();
    signal.sub(fn);
    signal.set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
  });

  it('should not call function if set value is the same', () => {
    const signal = new Signal(1);
    const fn = vi.fn();
    signal.sub(fn);
    signal.set(1);
    expect(fn).toBeCalledTimes(0);
  });
});

describe('unsub', () => {
  it('should not call passed function if signal was changed', () => {
    const signal = new Signal(1);
    const fn = vi.fn();
    signal.sub(fn);
    signal.set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
    fn.mockClear();

    signal.unsub(fn);
    signal.set(3);
    expect(fn).toBeCalledTimes(0);
  });
});

describe('unsubAll', () => {
  it('should remove all listeners', () => {
    const signal = new Signal(1);
    const fn = vi.fn();
    const fn2 = vi.fn();
    signal.sub(fn);
    signal.sub(fn2);
    signal.set(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn2).toBeCalledTimes(1);
    fn.mockClear();
    fn2.mockClear();

    signal.unsubAll();
    signal.set(3);
    expect(fn).toBeCalledTimes(0);
    expect(fn2).toBeCalledTimes(0);
  });
});
