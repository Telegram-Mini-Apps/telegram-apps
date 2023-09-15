import { on, off } from '../../src/index.js';
import { createWindow, type WindowSpy } from '../__utils__/createWindow.js';
import { dispatchWindowMessageEvent } from '../__utils__/dispatchWindowMessageEvent.js';

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow();
});

afterEach(() => {
  windowSpy.mockReset();
});

describe('events', () => {
  describe('off.ts', () => {
    describe('off', () => {
      it('should remove listener', () => {
        const listener = jest.fn();
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
