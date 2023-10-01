import { expect, test, vi, beforeEach, afterEach } from 'vitest';

import { on } from '../../src/index.js';
import { createWindow, type WindowSpy } from '../../__test-utils__/createWindow.js';
import { dispatchWindowMessageEvent } from '../../__test-utils__/dispatchWindowMessageEvent.js';

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow();
});

afterEach(() => {
  windowSpy.mockReset();
});

test('events', () => {
  test('on.ts', () => {
    test('on', () => {
     test('should call listener in case, Telegram event was created', () => {
        const listener = vi.fn();
        on('viewport_changed', listener);

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

     test('should remove listener in case, returned callback was called', () => {
        const listener = vi.fn();
        const emit = () => dispatchWindowMessageEvent('viewport_changed', {
          height: 123,
          width: 321,
          is_expanded: false,
          is_state_stable: false,
        });

        const off = on('viewport_changed', listener);
        emit();
        expect(listener).toHaveBeenCalledTimes(1);

        off();
        emit();
        expect(listener).toHaveBeenCalledTimes(1);
      });
    });
  });
});
