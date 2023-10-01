import { expect, test, vi, afterEach } from 'vitest';

import {
  log,
  setDebug,
  setTargetOrigin,
  targetOrigin,
} from '../src/globals.js';

afterEach(() => {
  vi.restoreAllMocks();
});

test('globals.ts', () => {
  test('log', () => {
   test('should log message in case, debug mode is enabled. Otherwise no output should be shown', () => {
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

  test('setTargetOrigin', () => {
   test('should return set value via targetOrigin() function', () => {
      setTargetOrigin('my test');
      expect(targetOrigin()).toEqual('my test');
    });
  });
});
