import { describe, expect, it, jest } from '@jest/globals';
import { BackButton } from '../../../src';

describe('components', () => {
  describe('BackButton', () => {
    describe('BackButton.ts', () => {
      describe('BackButton', () => {
        describe('hide', () => {
          it('should call "web_app_setup_back_button" method '
            + 'with "is_visible" equal to false', () => {
            const postEvent = jest.fn();
            const backButton = new BackButton({ postEvent } as any, '');

            expect(postEvent).toHaveBeenCalledTimes(0);
            backButton.hide();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_setup_back_button', { is_visible: false });
          });

          it('should emit "isVisibleChanged" event with false value', () => {
            const backButton = new BackButton({ postEvent: jest.fn() } as any, '');
            const listener = jest.fn();

            backButton.show();

            backButton.on('isVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            backButton.hide();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        describe('show', () => {
          it('should call "web_app_setup_back_button" method '
            + 'with "is_visible" equal to true', () => {
            const postEvent = jest.fn();
            const backButton = new BackButton({ postEvent } as any, '');

            expect(postEvent).toHaveBeenCalledTimes(0);
            backButton.show();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_setup_back_button', { is_visible: true });
          });

          it('should emit "isVisibleChanged" event with true value', () => {
            const backButton = new BackButton({ postEvent: jest.fn() } as any, '');
            const listener = jest.fn();

            backButton.on('isVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            backButton.show();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        describe('on', () => {
          describe('"click" event', () => {
            it('should add event listener to bridge\'s '
              + '"back_button_pressed" event', () => {
              const on = jest.fn();
              const backButton = new BackButton({ on } as any, '');
              const listener = jest.fn();

              expect(on).toHaveBeenCalledTimes(0);
              backButton.on('click', listener);
              expect(on).toHaveBeenCalledTimes(1);
              expect(on).toHaveBeenCalledWith('back_button_pressed', listener);
            });
          });
        });

        describe('off', () => {
          describe('"click" event', () => {
            it('should remove event listener from bridge\'s '
              + '"back_button_pressed" event', () => {
              const on = jest.fn();
              const off = jest.fn();
              const backButton = new BackButton({ on, off } as any, '');
              const listener = jest.fn();

              expect(on).toHaveBeenCalledTimes(0);
              backButton.on('click', listener);
              expect(on).toHaveBeenCalledTimes(1);
              expect(on).toHaveBeenCalledWith('back_button_pressed', listener);

              // TODO: We should probably emit back_button_pressed event to
              //  make sure, listener was removed.

              expect(off).toHaveBeenCalledTimes(0);
              backButton.off('click', listener);
              expect(off).toHaveBeenCalledTimes(1);
              expect(off).toHaveBeenCalledWith('back_button_pressed', listener);
            });
          });

          describe('"isVisibleChanged" event', () => {
            it('should remove event listener from event', () => {
              const listener = jest.fn();
              const backButton = new BackButton({ postEvent: jest.fn() } as any, '');

              backButton.on('isVisibleChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              backButton.show();
              expect(listener).toHaveBeenCalledTimes(1);

              backButton.off('isVisibleChanged', listener);

              expect(listener).toHaveBeenCalledTimes(1);
              backButton.hide();
              expect(listener).toHaveBeenCalledTimes(1);
            });
          });
        });

        describe('supports', () => {
          describe('show / hide', () => {
            it('should return true in case, BackButton '
              + 'version is 6.1 or higher. False, otherwise', () => {
              const backButton1 = new BackButton({} as any, '6.0');
              expect(backButton1.supports('show')).toBe(false);
              expect(backButton1.supports('hide')).toBe(false);

              const backButton2 = new BackButton({} as any, '6.1');
              expect(backButton2.supports('show')).toBe(true);
              expect(backButton2.supports('hide')).toBe(true);

              const backButton3 = new BackButton({} as any, '6.2');
              expect(backButton3.supports('show')).toBe(true);
              expect(backButton3.supports('hide')).toBe(true);
            });
          });
        });
      });
    });
  });
});
