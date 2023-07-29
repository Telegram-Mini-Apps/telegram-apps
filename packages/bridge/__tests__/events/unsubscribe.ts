import { subscribe, unsubscribe } from '../../src/index.js';
import { dispatchWindowEvent, mockWindow } from '../__utils__/window.js';

mockWindow();

describe('events', () => {
  describe('unsubscribe.ts', () => {
    describe('unsubscribe', () => {
      it('should remove listener', () => {
        const listener = jest.fn();
        const emit = () => dispatchWindowEvent('viewport_changed', {
          height: 123,
          width: 321,
          is_expanded: false,
          is_state_stable: false,
        });

        subscribe(listener);
        emit();
        expect(listener).toHaveBeenCalledTimes(1);

        unsubscribe(listener);
        emit();
        expect(listener).toHaveBeenCalledTimes(1);
      });
    });
  });
});
