import { describe, expect, it, vi } from 'vitest';

import { EnhancedPromise } from './EnhancedPromise.js';

describe('resolve', () => {
  it('should resolve specified value', async () => {
    const p = new EnhancedPromise();
    p.resolve('abc');
    await expect(p).resolves.toBe('abc');
  });
});

describe('then', () => {
  it('should create promise with resolve and reject of original one', () => {
    const p = new EnhancedPromise<string>();
    const resolve = vi.spyOn(p, 'resolve');

    const p2 = p.then();
    p2.resolve('Hey Mark!');
    expect(resolve).toHaveBeenCalledOnce();
    expect(resolve).toHaveBeenCalledWith('Hey Mark!');
  });

  it('should be called with previous promise result', async () => {
    const spyA = vi.fn(r => r + 1);
    const spyB = vi.fn(r => r + 2);
    const p = new EnhancedPromise<number>().then(spyA).then(spyB);
    p.resolve(1);

    await expect(p).resolves.toBe(4);
    expect(spyA).toHaveBeenCalledOnce();
    expect(spyA).toHaveBeenCalledWith(1);
    expect(spyB).toHaveBeenCalledWith(2);
  });
});

describe('catch', () => {
  it('should create promise with resolve and reject of original one', () => {
    const p = new EnhancedPromise<string>();
    const resolve = vi.spyOn(p, 'resolve');
    const reject = vi.spyOn(p, 'reject');

    const p2 = p.catch();
    p2.resolve('Hey Mark!');
    expect(resolve).toHaveBeenCalledOnce();
    expect(resolve).toHaveBeenCalledWith('Hey Mark!');

    const p3 = p.catch();
    p3.reject(new Error('Oops'));
    expect(reject).toHaveBeenCalledOnce();
    expect(reject).toHaveBeenCalledWith(new Error('Oops'));
  });

  it('should handle error', async () => {
    const spy = vi.fn();
    const p = new EnhancedPromise<string>().catch(spy);
    p.reject(new Error('Well..'));

    await p;
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(new Error('Well..'));
  });
});

describe('finally', () => {
  it('should create promise with resolve and reject of original one', () => {
    const p = new EnhancedPromise<string>();
    const resolve = vi.spyOn(p, 'resolve');
    const reject = vi.spyOn(p, 'reject');

    const p2 = p.finally();
    p2.resolve('Hey Mark!');
    expect(resolve).toHaveBeenCalledOnce();
    expect(resolve).toHaveBeenCalledWith('Hey Mark!');

    const p3 = p.catch();
    p3.reject(new Error('Oops'));
    expect(reject).toHaveBeenCalledOnce();
    expect(reject).toHaveBeenCalledWith(new Error('Oops'));
  });

  it('should call handler in any case', async () => {
    const spy = vi.fn();
    const p = new EnhancedPromise<string>().finally(spy);
    p.resolve('Hey!');

    await p;
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith();

    const spy2 = vi.fn();
    const p2 = new EnhancedPromise<string>()
      .catch(() => {
      })
      .finally(spy2);
    p2.reject(new Error('Well..'));

    await p2;
    expect(spy2).toHaveBeenCalledOnce();
    expect(spy2).toHaveBeenCalledWith();
  });
});
