import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { isTimeoutError, TimeoutError, withTimeout } from '../src/index.js';

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

describe('withTimeout.ts', () => {
  describe('withTimeout', () => {
    describe('wrapped value is function', async () => {
      it('should throw an error in case timeout reached', () => {
        const wrapped = withTimeout(() => new Promise((res) => {
          setTimeout(res, 500);
        }), 100);

        Promise.resolve().then(() => vi.advanceTimersByTime(500));
        expect(wrapped()).rejects.toStrictEqual(new TimeoutError(100));
      }, 1000);

      it('should return resolved value by wrapped function', () => {
        const wrapped = withTimeout(() => new Promise((res) => {
          res('I am fine');
        }), 100);

        expect(wrapped()).resolves.toBe('I am fine');
      }, 1000);
    });

    describe('wrapped value is promise', () => {
      it('should throw an error in case timeout reached', () => {
        Promise.resolve().then(() => vi.advanceTimersByTime(500));

        const wrapped = withTimeout(new Promise((res) => {
          setTimeout(res, 500);
        }), 100);

        expect(wrapped).rejects.toStrictEqual(new TimeoutError(100));
      }, 1000);

      it('should return resolved value by wrapped function', () => {
        const wrapped = withTimeout(Promise.resolve('I am fine'), 100);

        expect(wrapped).resolves.toBe('I am fine');
      }, 1000);
    });
  });

  describe('isTimeoutError', () => {
    it('should return true if passed value is instance of TimeoutError', () => {
      expect(isTimeoutError(null)).toBe(false);
      expect(isTimeoutError(new TimeoutError(1000))).toBe(true);
    });
  });
});
