import { expect, test, vi, beforeEach, afterEach } from 'vitest';

import { on, off } from '../../src/index.js';
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
  test('off.ts', () => {
    test('off', () => {
     test('should remove listener', () => {
        const listener = vi.fn();
        const emit = () => dispatchWindowMessageEvent('viewport_changed', {
          height: 123,
          width: 321,
          is_expanded: false,
          is_state_stable: false,
        });

        on('viewport_changed', listener);
        emit();
        expect(listener).toHaveBeenCalledTimes(1);

        off('viewport_changed', listener);
        emit();
        expect(listener).toHaveBeenCalledTimes(1);
      });
    });
  });
});
