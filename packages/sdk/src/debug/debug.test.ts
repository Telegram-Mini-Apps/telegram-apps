import { afterEach, describe, expect, it, vi } from 'vitest';

import { resetMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';
import { log, logger, setDebug } from '@/debug/debug.js';

import { dispatchWindowMessageEvent } from '../../test-utils/dispatchWindowMessageEvent.js';

afterEach(() => {
  vi.restoreAllMocks();

  // Reset debug mode after each test.
  setDebug(false);
  resetMiniAppsEventEmitter();
});

describe('setDebug', () => {
  it('should output log in the console, if debug mode is enabled', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => null);
    setDebug(true);
    dispatchWindowMessageEvent('back_button_pressed');
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

    setDebug(false);
    dispatchWindowMessageEvent('back_button_pressed');
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('log', () => {
  it('should call logger.log if debug mode is enabled', () => {
    const spy = vi.spyOn(logger, 'log').mockImplementationOnce(() => null);
    setDebug(true);
    log('abc');

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('abc');
    spy.mockClear();

    setDebug(false);
    log('abc');
    expect(spy).not.toHaveBeenCalled();
  });
});
