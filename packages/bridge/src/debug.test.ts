import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchMiniAppsEvent } from 'test-utils';

import { resetMiniAppsEventEmitter } from './events/event-emitter/singleton.js';
import { debugLog, debug } from './debug.js';

beforeEach(() => {
  vi.restoreAllMocks();
  debug.reset();
  resetMiniAppsEventEmitter();
});

describe('debug.set', () => {
  it('should output Mini Apps event log in console if debug mode is enabled', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => null);
    debug.set(true);
    dispatchMiniAppsEvent('back_button_pressed');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      'Event received:',
      { name: 'back_button_pressed' },
    );
    spy.mockClear();

    debug.set(false);
    dispatchMiniAppsEvent('back_button_pressed');
    expect(spy).not.toHaveBeenCalled();
  });
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
