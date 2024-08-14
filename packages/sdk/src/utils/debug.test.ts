import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetMiniAppsEventEmitter, debug } from '@telegram-apps/bridge';

import { debugLog } from './debug.js';

beforeEach(() => {
  vi.restoreAllMocks();
  debug.reset();
  resetMiniAppsEventEmitter();
});

describe('debugLog', () => {
  it('should output log in console if debug mode is enabled', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => null);
    debug.set(true);
    debugLog('abc');

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      'abc',
    );
    spy.mockClear();

    debug.set(false);
    debugLog('abc');
    expect(spy).not.toHaveBeenCalled();
  });
});
