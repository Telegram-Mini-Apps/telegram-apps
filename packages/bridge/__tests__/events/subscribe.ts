import { subscribe } from '../../src/index.js';
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
  describe('subscribe.ts', () => {
    describe('subscribe', () => {
      it('should call listener in case, Telegram event was created', () => {
        const listener = jest.fn();
        subscribe(listener);

        const eventData = {
          height: 123,
          width: 321,
          is_expanded: false,
          is_state_stable: false,
        };
        dispatchWindowMessageEvent('viewport_changed', eventData);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith('viewport_changed', eventData);
      });

      it('should remove listener in case, returned callback was called', () => {
        const listener = jest.fn();
        const emit = () => dispatchWindowMessageEvent('viewport_changed', {
          height: 123,
          width: 321,
          is_expanded: false,
          is_state_stable: false,
        });

        const unsubscribe = subscribe(listener);
        emit();
        expect(listener).toHaveBeenCalledTimes(1);

        unsubscribe();
        emit();
        expect(listener).toHaveBeenCalledTimes(1);
      });
    });
  });
});
