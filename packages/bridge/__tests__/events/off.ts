import { on, off } from '../../src/index.js';
import { dispatchWindowEvent, mockWindow } from '../__utils__/window.js';

mockWindow();

describe('events', () => {
  describe('off.ts', () => {
    describe('off', () => {
      it('should remove listener', () => {
        const listener = jest.fn();
        const emit = () => dispatchWindowEvent('viewport_changed', {
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
