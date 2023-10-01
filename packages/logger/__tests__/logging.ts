import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { log } from '../src/index.js';

const now = new Date('2022-11-04T09:09:43.007Z');

beforeAll(() => {
  vi.useFakeTimers().setSystemTime(now);
});

afterAll(() => {
  vi.useRealTimers();
});

describe('logging.ts', () => {
  describe('log', () => {
    it('should call console.log if level is "log"', () => {
      const spy = vi.spyOn(console, 'log').mockImplementationOnce(() => {
      });
      log('log', 123, 'abc');
      expect(spy).toBeCalledWith('[09:09:43.007]', 123, 'abc');
    });

    it('should call console.error if level is "error"', () => {
      const spy = vi.spyOn(console, 'error').mockImplementationOnce(() => {
      });
      log('error', 'text', 100);
      expect(spy).toBeCalledWith('[09:09:43.007]', 'text', 100);
    });
  });
});
