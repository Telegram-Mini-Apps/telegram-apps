import { expect, test, vi } from 'vitest';

import { ClosingBehaviour } from '../../../src/index.js';

test('components', () => {
  test('ClosingBehaviour', () => {
    test('ClosingBehaviour.ts', () => {
      test('ClosingBehaviour', () => {
        test('disable', () => {
         test('should call "web_app_setup_closing_behavior" method with "need_confirmation" equal to false', () => {
            const postEvent = vi.fn();
            const confirmation = new ClosingBehaviour(true, postEvent);

            expect(postEvent).toHaveBeenCalledTimes(0);
            confirmation.disableConfirmation();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_setup_closing_behavior', { need_confirmation: false });
          });

         test('should emit "isConfirmationNeededChanged" event with false value', () => {
            const confirmation = new ClosingBehaviour(true, vi.fn());
            const listener = vi.fn();

            confirmation.on('isConfirmationNeededChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            confirmation.disableConfirmation();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        test('enable', () => {
         test('should call "web_app_setup_closing_behavior" method with "need_confirmation" equal to true', () => {
            const postEvent = vi.fn();
            const confirmation = new ClosingBehaviour(false, postEvent);

            expect(postEvent).toHaveBeenCalledTimes(0);
            confirmation.enableConfirmation();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_setup_closing_behavior', { need_confirmation: true });
          });

         test('should emit "isConfirmationNeededChanged" event with true value', () => {
            const confirmation = new ClosingBehaviour(false, vi.fn());
            const listener = vi.fn();

            confirmation.on('isConfirmationNeededChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            confirmation.enableConfirmation();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        test('on', () => {
          test('"isConfirmationNeededChanged" event', () => {
           test('should add event listener to event', () => {
              const listener = vi.fn();
              const confirmation = new ClosingBehaviour(false, vi.fn());

              confirmation.on('isConfirmationNeededChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              confirmation.enableConfirmation();
              expect(listener).toHaveBeenCalledTimes(1);
            });
          });
        });

        test('off', () => {
          test('"isConfirmationNeededChanged" event', () => {
           test('should remove event listener from event', () => {
              const listener = vi.fn();
              const confirmation = new ClosingBehaviour(false, vi.fn());

              confirmation.on('isConfirmationNeededChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              confirmation.enableConfirmation();
              expect(listener).toHaveBeenCalledTimes(1);

              confirmation.off('isConfirmationNeededChanged', listener);
              listener.mockClear();

              expect(listener).toHaveBeenCalledTimes(0);
              confirmation.disableConfirmation();
              expect(listener).toHaveBeenCalledTimes(0);
            });
          });
        });
      });
    });
  });
});
