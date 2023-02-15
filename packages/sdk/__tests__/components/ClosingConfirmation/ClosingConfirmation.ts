import {describe, expect, it, jest} from '@jest/globals';
import {ClosingConfirmation} from '../../../src';

describe('components', () => {
  describe('ClosingConfirmation', () => {
    describe('ClosingConfirmation.ts', () => {
      describe('ClosingConfirmation', () => {
        describe('disable', () => {
          it('should call "web_app_setup_closing_behavior" method ' +
            'with "need_confirmation" equal to false', () => {
            const postEvent = jest.fn();
            const confirmation = new ClosingConfirmation({postEvent} as any);

            confirmation.enable();
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            confirmation.disable();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_setup_closing_behavior', {need_confirmation: false});
          });

          it('should emit "isEnabledChanged" event with false value', () => {
            const confirmation = new ClosingConfirmation({postEvent: jest.fn()} as any);
            const listener = jest.fn();

            confirmation.enable();

            confirmation.on('isEnabledChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            confirmation.disable();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        describe('enable', () => {
          it('should call "web_app_setup_closing_behavior" method ' +
            'with "need_confirmation" equal to true', () => {
            const postEvent = jest.fn();
            const confirmation = new ClosingConfirmation({postEvent} as any);

            expect(postEvent).toHaveBeenCalledTimes(0);
            confirmation.enable();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_setup_closing_behavior', {need_confirmation: true});
          });

          it('should emit "isEnabledChanged" event with true value', () => {
            const confirmation = new ClosingConfirmation({postEvent: jest.fn()} as any);
            const listener = jest.fn();

            confirmation.on('isEnabledChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            confirmation.enable();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        describe('on', () => {
          describe('"isEnabledChanged" event', () => {
            it('should remove event listener from event', () => {
              const listener = jest.fn();
              const confirmation = new ClosingConfirmation({postEvent: jest.fn()} as any);

              confirmation.on('isEnabledChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              confirmation.enable();
              expect(listener).toHaveBeenCalledTimes(1);

              confirmation.off('isEnabledChanged', listener);
              listener.mockClear();

              expect(listener).toHaveBeenCalledTimes(0);
              confirmation.disable();
              expect(listener).toHaveBeenCalledTimes(0);
            });
          });
        });

        describe('off', () => {
          describe('"isEnabledChanged" event', () => {
            it('should remove event listener from event', () => {
              const listener = jest.fn();
              const confirmation = new ClosingConfirmation({postEvent: jest.fn()} as any);

              confirmation.on('isEnabledChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              confirmation.enable();
              expect(listener).toHaveBeenCalledTimes(1);

              confirmation.off('isEnabledChanged', listener);
              listener.mockClear();

              expect(listener).toHaveBeenCalledTimes(0);
              confirmation.disable();
              expect(listener).toHaveBeenCalledTimes(0);
            });
          });
        });
      });
    });
  });
});