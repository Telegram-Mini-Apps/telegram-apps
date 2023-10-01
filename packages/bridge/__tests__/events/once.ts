import { expect, vi, afterEach, describe, it, beforeEach } from 'vitest';

import { once } from '../../src/index.js';
import { createWindow, type WindowSpy } from '../../__test-utils__/createWindow.js';
import { dispatchWindowMessageEvent } from '../../__test-utils__/dispatchWindowMessageEvent.js';

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow();
});

afterEach(() => {
  windowSpy.mockRestore();
});

describe('events', () => {
  describe('once.ts', () => {
    describe('once', () => {
      it('should call listener in case, Telegram event was created', () => {
        const listener = vi.fn();
        once('viewport_changed', listener);

        const eventData = {
          height: 123,
          width: 321,
          is_expanded: false,
          is_state_stable: false,
        };
        dispatchWindowMessageEvent('viewport_changed', eventData);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(eventData);
      });

      it('should remove listener in case, returned callback was called', () => {
        const listener = vi.fn();
        const emit = () => dispatchWindowMessageEvent('viewport_changed', {
          height: 123,
          width: 321,
          is_expanded: false,
          is_state_stable: false,
        });

        const off = once('viewport_changed', listener);

        off();
        emit();
        expect(listener).toHaveBeenCalledTimes(0);
      });

      it('should remove listener in case, listener was called', () => {
        const listener = vi.fn();
        const emit = () => dispatchWindowMessageEvent('viewport_changed', {
          height: 123,
          width: 321,
          is_expanded: false,
          is_state_stable: false,
        });

        once('viewport_changed', listener);
        emit();
        expect(listener).toHaveBeenCalledTimes(1);

        emit();
        expect(listener).toHaveBeenCalledTimes(1);
      });
    });
  });
});
