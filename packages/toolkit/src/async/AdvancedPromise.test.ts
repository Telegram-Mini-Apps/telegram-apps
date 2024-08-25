import { expect, beforeAll, describe, vi, it, afterAll } from 'vitest';

import { AdvancedPromise } from '@/async/AdvancedPromise.js';
import { TypedError } from '@/errors/TypedError.js';

describe('cancel', () => {
  it('should reject promise with TypedError of type ERR_CANCELLED', async () => {
    const p = new AdvancedPromise();
    p.cancel();
    await expect(p).rejects.toStrictEqual(new TypedError('ERR_CANCELLED'));
  });
});

describe('resolve', () => {
  it('should resolve specified value', async () => {
    const p = new AdvancedPromise();
    p.resolve('abc');
    await expect(p).resolves.toBe('abc');
  });
});

describe('reject', () => {
  it('should reject specified value', async () => {
    const p = new AdvancedPromise();
    p.reject(new Error('REJECT REASON'));
    await expect(p).rejects.toStrictEqual(new Error('REJECT REASON'));
  });
});

it('should behave like usual promise', async () => {
  await expect(
    new AdvancedPromise(res => res(true)),
  ).resolves.toBe(true);

  await expect(
    new AdvancedPromise((_, rej) => rej(new Error('ERR'))),
  ).rejects.toStrictEqual(new Error('ERR'));
});

describe('withOptions', () => {
  describe('timeout', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it('should reject promise with ERR_TIMED_OUT if deadline was reached', async () => {
      const p = AdvancedPromise.withOptions({ timeout: 100 });
      vi.advanceTimersByTime(200);
      await expect(p).rejects.toMatchObject(new TypedError('ERR_TIMED_OUT', 'Timeout reached: 100ms'));
    });
  });

  describe('abortSignal', () => {
    it('should reject promise with ERR_ABORTED if signal was aborted', async () => {
      const controller = new AbortController();
      const p = AdvancedPromise.withOptions({ abortSignal: controller.signal });

      controller.abort(new Error('Just something'));
      await expect(p).rejects.toStrictEqual(new TypedError('ERR_ABORTED', {
        cause: new Error('Just something'),
      }));
    });
  });
});