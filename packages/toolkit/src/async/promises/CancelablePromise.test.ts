import { expect, beforeAll, describe, vi, it, afterAll } from 'vitest';

import { TypedError } from '@/errors/TypedError.js';

import { CancelablePromise } from './CancelablePromise.js';

describe('constructor', () => {
  it('should instantly reject with ERR_ABORTED if passed signal was aborted', async () => {
    const c = new AbortController();
    c.abort(new Error('TEST'));
    const p = new CancelablePromise({ abortSignal: c.signal });

    await expect(p).rejects.toStrictEqual(new TypedError('ERR_ABORTED', {
      cause: new Error('TEST'),
    }));
  });

  it('should notify executor if signal was aborted', () => {
    const spy = vi.fn();
    const p = new CancelablePromise((_res, _rej, signal) => {
      signal.addEventListener('abort', () => {
        spy(signal.reason);
      });
    })
      .catch(() => {
      });

    p.reject(new Error('TEST_ERROR'));
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(new Error('TEST_ERROR'));
  });

  describe('options', () => {
    describe('abortSignal', () => {
      it('should reject promise if signal was aborted', async () => {
        const c = new AbortController();
        const p = new CancelablePromise({ abortSignal: c.signal });

        await Promise.resolve().then(async () => {
          c.abort(new Error('TEST'));
          await expect(p).rejects.toStrictEqual(new TypedError('ERR_ABORTED', {
            cause: new Error('TEST'),
          }));
        });
      });
    });

    describe('timeout', () => {
      beforeAll(() => {
        vi.useFakeTimers();
      });

      afterAll(() => {
        vi.useRealTimers();
      });

      it('should reject with ERR_TIMED_OUT if timeout was reached', async () => {
        const p = new CancelablePromise({ timeout: 100 });
        vi.advanceTimersByTime(200);
        await expect(p).rejects.toStrictEqual(new TypedError('ERR_TIMED_OUT', {
          message: 'Timeout reached: 100ms',
        }));
      });
    });
  });
});

describe('cancel', () => {
  it('should reject promise with TypedError of type ERR_CANCELED', async () => {
    const p = new CancelablePromise();
    p.cancel();
    await expect(p).rejects.toStrictEqual(new TypedError('ERR_CANCELED'));
  });
});

describe('reject', () => {
  it('should reject specified value', async () => {
    const p = new CancelablePromise();
    p.reject(new Error('REJECT REASON'));
    await expect(p).rejects.toStrictEqual(new Error('REJECT REASON'));
  });
});

it('should behave like usual promise', async () => {
  await expect(
    new CancelablePromise(res => res(true)),
  ).resolves.toBe(true);

  await expect(
    new CancelablePromise((_, rej) => rej(new Error('ERR'))),
  ).rejects.toStrictEqual(new Error('ERR'));
});

describe('then', () => {
  it('should create promise with reject of original one', () => {
    const p = new CancelablePromise<string>();
    const reject = vi.spyOn(p, 'reject');

    const p2 = p.then().catch(() => {
    });
    p2.reject(new Error('Oops'));
    expect(reject).toHaveBeenCalledOnce();
    expect(reject).toHaveBeenCalledWith(new Error('Oops'));
  });

  it('should be called with previous promise result', async () => {
    const spyA = vi.fn(r => r + 1);
    const spyB = vi.fn(r => r + 2);
    const p = new CancelablePromise<number>(res => res(1)).then(spyA).then(spyB);

    await expect(p).resolves.toBe(4);
    expect(spyA).toHaveBeenCalledOnce();
    expect(spyA).toHaveBeenCalledWith(1);
    expect(spyB).toHaveBeenCalledWith(2);
  });
});

describe('catch', () => {
  it('should create promise with reject of original one', () => {
    const p = new CancelablePromise<string>();
    const reject = vi.spyOn(p, 'reject');

    const p2 = p.catch(() => {
    });
    p2.reject(new Error('Oops'));
    expect(reject).toHaveBeenCalledOnce();
    expect(reject).toHaveBeenCalledWith(new Error('Oops'));
  });

  it('should handle error', async () => {
    const spy = vi.fn();
    const p = new CancelablePromise<string>().catch(spy);
    p.reject(new Error('Well..'));

    await p;
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(new Error('Well..'));
  });
});

describe('finally', () => {
  it('should create promise with reject of original one', () => {
    const p = new CancelablePromise<string>();
    const reject = vi.spyOn(p, 'reject');

    const p2 = p.catch(() => {
    });
    p2.reject(new Error('Oops'));
    expect(reject).toHaveBeenCalledOnce();
    expect(reject).toHaveBeenCalledWith(new Error('Oops'));
  });

  it('should call handler in any case', async () => {
    const spy2 = vi.fn();
    const p = new CancelablePromise<string>()
      .catch(() => {
      })
      .finally(spy2);
    p.reject(new Error('Well..'));

    await p;
    expect(spy2).toHaveBeenCalledOnce();
    expect(spy2).toHaveBeenCalledWith();
  });
});

describe('withFn', () => {
  it('should resolve result of function execution', async () => {
    await expect(CancelablePromise.withFn(() => true)).resolves.toBe(true);
    await expect(CancelablePromise.withFn(() => {
      throw new Error('Oops');
    })).rejects.toStrictEqual(new Error('Oops'));
  });
});