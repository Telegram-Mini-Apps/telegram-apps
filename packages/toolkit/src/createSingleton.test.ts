import { vi, expect, it, describe } from 'vitest';

import { EventEmitter } from './event-emitter/EventEmitter.js';

import { createSingleton } from './createSingleton.js';

describe('create', () => {
  it('should call function only once and return the first call result', () => {
    const create = vi.fn(() => ({}));
    const [get] = createSingleton(create);
    const a = get();
    const b = get();
    expect(a).toBe(b);
    expect(create).toHaveBeenCalledOnce();
  });

  it('should reset singleton in case, passed to function "reset" argument was called', () => {
    const ee = new EventEmitter<{ reset: never }>();
    const create = vi.fn((reset: () => void) => {
      ee.on('reset', reset, true);
      return { prop: 'value' };
    });
    const [get] = createSingleton(create);
    const a = get();
    expect(a).toStrictEqual({ prop: 'value' });

    ee.emit('reset');
    expect(get()).not.toBe(a);
  });
});

describe('onReset', () => {
  it('should call function if singleton was reset and singleton contained some value', () => {
    const create = vi.fn(() => ({}));
    const onReset = vi.fn();
    const [get, reset] = createSingleton(create, onReset);

    reset();
    expect(onReset).not.toHaveBeenCalled();

    get();
    reset();
    expect(onReset).toHaveBeenCalledOnce();
    expect(onReset).toHaveBeenCalledWith({});
  });
});