import { expect, it, vi, afterEach, describe } from 'vitest';

import {
  log,
  setDebug,
  setTargetOrigin,
  targetOrigin,
} from '../src/globals.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('globals.ts', () => {
  describe('log', () => {
    it('should log message in case, debug mode is enabled. Otherwise no output should be shown', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {
      });

      log('log', 123);
      expect(spy).not.toHaveBeenCalled();

      setDebug(true);
      log('log', 'Some log');
      expect(spy).toHaveBeenCalledTimes(1);

      setDebug(false);
      log('log', 'Another log');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setTargetOrigin', () => {
    it('should return set value via targetOrigin() function', () => {
      setTargetOrigin('my test');
      expect(targetOrigin()).toEqual('my test');
    });
  });
});
