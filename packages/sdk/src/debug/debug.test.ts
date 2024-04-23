import { afterEach, describe, expect, it, vi } from 'vitest';

import { logger, setDebug } from '@/debug/debug.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('logger', () => {
  it('should log message in case, debug mode is enabled. Otherwise no output should be shown', () => {
    const spy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {
      });

    logger.log(123);
    expect(spy).not.toHaveBeenCalled();

    setDebug(true);
    logger.log('Some log');
    expect(spy).toHaveBeenCalledTimes(1);

    setDebug(false);
    logger.log('Another log');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
