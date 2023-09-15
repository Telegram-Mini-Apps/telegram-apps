import { ClosingBehaviour } from '../../../src/index.js';

describe('components', () => {
  describe('ClosingBehaviour', () => {
    describe('ClosingBehaviour.ts', () => {
      describe('ClosingBehaviour', () => {
        describe('disable', () => {
          it('should call "web_app_setup_closing_behavior" method with "need_confirmation" equal to false', () => {
            const postEvent = jest.fn();
            const confirmation = new ClosingBehaviour(postEvent);

            confirmation.enableConfirmation();
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            confirmation.disableConfirmation();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_setup_closing_behavior', { need_confirmation: false });
          });

          it('should emit "isConfirmationNeededChanged" event with false value', () => {
            const confirmation = new ClosingBehaviour(jest.fn());
            const listener = jest.fn();

            confirmation.enableConfirmation();

            confirmation.on('isConfirmationNeededChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            confirmation.disableConfirmation();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        describe('enable', () => {
          it('should call "web_app_setup_closing_behavior" method with "need_confirmation" equal to true', () => {
            const postEvent = jest.fn();
            const confirmation = new ClosingBehaviour(postEvent);

            expect(postEvent).toHaveBeenCalledTimes(0);
            confirmation.enableConfirmation();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_setup_closing_behavior', { need_confirmation: true });
          });

          it('should emit "isConfirmationNeededChanged" event with true value', () => {
            const confirmation = new ClosingBehaviour(jest.fn());
            const listener = jest.fn();

            confirmation.on('isConfirmationNeededChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            confirmation.enableConfirmation();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        describe('on', () => {
          describe('"isConfirmationNeededChanged" event', () => {
            it('should add event listener to event', () => {
              const listener = jest.fn();
              const confirmation = new ClosingBehaviour(jest.fn());

              confirmation.on('isConfirmationNeededChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              confirmation.enableConfirmation();
              expect(listener).toHaveBeenCalledTimes(1);
            });
          });
        });

        describe('off', () => {
          describe('"isConfirmationNeededChanged" event', () => {
            it('should remove event listener from event', () => {
              const listener = jest.fn();
              const confirmation = new ClosingBehaviour(jest.fn());

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
