import { expect, test, vi } from 'vitest';
import { isTimeoutError, TimeoutError, withTimeout } from '../src/index.js';

vi.useFakeTimers();

test('withTimeout.ts', () => {
  test('withTimeout', () => {
    test('wrapped value is function', () => {
      test('should throw an error in case timeout reached', () => {
        const func = vi.fn(() => new Promise((res) => {
          setTimeout(res, 500);
        }));
        const wrapped = withTimeout(func, 100);

        expect(wrapped()).rejects.toHaveLength(1);
      });

      test('should return resolved value by wrapped function', () => {
        const func = vi.fn(() => new Promise((res) => {
          setTimeout(() => res('I am fine'), 100);
        }));
        const wrapped = withTimeout(func, 500);

        expect(wrapped()).resolves.toBe(['I am fine']);
      });
    });

    test('wrapped value is promise', () => {
      test('should throw an error in case timeout reached', () => {
        const promise = new Promise((res) => {
          setTimeout(res, 500);
        });
        const wrapped = withTimeout(promise, 100);

        expect(wrapped).rejects.toHaveLength(1);
      });

      test('should return resolved value by wrapped function', () => {
        const promise = new Promise((res) => {
          setTimeout(() => res('I am fine'), 100);
        });
        const wrapped = withTimeout(promise, 500);

        expect(wrapped).resolves.toBe(['I am fine']);
      });
    });
  });

  test('isTimeoutError', () => {
    test('should return true if passed value is instance of TimeoutError', () => {
      expect(isTimeoutError(null)).toBe(false);
      expect(isTimeoutError(new TimeoutError(1000))).toBe(true);
    });
  });
});
