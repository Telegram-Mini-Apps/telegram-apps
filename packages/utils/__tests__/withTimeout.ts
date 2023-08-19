import { isTimeoutError, TimeoutError, withTimeout } from '../src';

jest.useFakeTimers();

describe('withTimeout.ts', () => {
  describe('withTimeout', () => {
    describe('wrapped value is function', () => {
      it('should throw an error in case timeout reached', () => {
        const func = jest.fn(() => new Promise((res) => {
          setTimeout(res, 500);
        }));
        const wrapped = withTimeout(func, 100);

        expect(wrapped()).rejects.toHaveLength(1);
      });

      it('should return resolved value by wrapped function', () => {
        const func = jest.fn(() => new Promise((res) => {
          setTimeout(() => res('I am fine'), 100);
        }));
        const wrapped = withTimeout(func, 500);

        expect(wrapped()).resolves.toBe(['I am fine']);
      });
    });

    describe('wrapped value is promise', () => {
      it('should throw an error in case timeout reached', () => {
        const promise = new Promise((res) => {
          setTimeout(res, 500);
        });
        const wrapped = withTimeout(promise, 100);

        expect(wrapped).rejects.toHaveLength(1);
      });

      it('should return resolved value by wrapped function', () => {
        const promise = new Promise((res) => {
          setTimeout(() => res('I am fine'), 100);
        });
        const wrapped = withTimeout(promise, 500);

        expect(wrapped).resolves.toBe(['I am fine']);
      });
    });
  });

  describe('isTimeoutError', () => {
    it('should return true if passed value is instance of TimeoutError', () => {
      expect(isTimeoutError(null)).toBe(false);
      expect(isTimeoutError(new TimeoutError(1000))).toBe(true);
    });
  });
});
