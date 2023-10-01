import { expect, test, vi } from 'vitest';

import { BackButton } from '../../../src/index.js';

test('components', () => {
  test('BackButton', () => {
    test('BackButton.ts', () => {
      test('BackButton', () => {
        test('hide', () => {
         test('should call "web_app_setup_back_button" method with "is_visible" equal to false', () => {
            const postEvent = vi.fn();
            const backButton = new BackButton(false, '', postEvent);

            expect(postEvent).toHaveBeenCalledTimes(0);
            backButton.hide();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_setup_back_button', { is_visible: false });
          });

         test('should emit "isVisibleChanged" event with false value', () => {
            const backButton = new BackButton(true, '', vi.fn());
            const listener = vi.fn();

            backButton.on('isVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            backButton.hide();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        test('show', () => {
         test('should call "web_app_setup_back_button" method with "is_visible" equal to true', () => {
            const postEvent = vi.fn();
            const backButton = new BackButton(false, '', postEvent);

            expect(postEvent).toHaveBeenCalledTimes(0);
            backButton.show();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_setup_back_button', { is_visible: true });
          });

         test('should emit "isVisibleChanged" event with true value', () => {
            const backButton = new BackButton(false, '', vi.fn());
            const listener = vi.fn();

            backButton.on('isVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            backButton.show();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        // FIXME
        // test('on', () => {
        //   test('"click" event', () => {
        //    test('should add event listener to bridge\'s '
        //       + '"back_button_pressed" event', () => {
        //       const on = vi.fn();
        //       const backButton = new BackButton({ on } as any, '');
        //       const listener = vi.fn();
        //
        //       expect(on).toHaveBeenCalledTimes(0);
        //       backButton.on('click', listener);
        //       expect(on).toHaveBeenCalledTimes(1);
        //       expect(on).toHaveBeenCalledWith('back_button_pressed', listener);
        //     });
        //   });
        // });

        test('off', () => {
          // FIXME
          // test('"click" event', () => {
          //  test('should remove event listener from bridge\'s '
          //     + '"back_button_pressed" event', () => {
          //     const on = vi.fn();
          //     const off = vi.fn();
          //     const backButton = new BackButton({ on, off } as any, '');
          //     const listener = vi.fn();
          //
          //     expect(on).toHaveBeenCalledTimes(0);
          //     backButton.on('click', listener);
          //     expect(on).toHaveBeenCalledTimes(1);
          //     expect(on).toHaveBeenCalledWith('back_button_pressed', listener);
          //
          //     // TODO: We should probably emit back_button_pressed event to
          //     //  make sure, listener was removed.
          //
          //     expect(off).toHaveBeenCalledTimes(0);
          //     backButton.off('click', listener);
          //     expect(off).toHaveBeenCalledTimes(1);
          //     expect(off).toHaveBeenCalledWith('back_button_pressed', listener);
          //   });
          // });

          test('"isVisibleChanged" event', () => {
           test('should remove event listener from event', () => {
              const listener = vi.fn();
              const backButton = new BackButton(false, '', vi.fn());

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

        test('supports', () => {
          test('show / hide', () => {
           test('should return true in case, BackButton version is 6.1 or higher. False, otherwise', () => {
              const backButton1 = new BackButton(false, '6.0');
              expect(backButton1.supports('show')).toBe(false);
              expect(backButton1.supports('hide')).toBe(false);

              const backButton2 = new BackButton(false, '6.1');
              expect(backButton2.supports('show')).toBe(true);
              expect(backButton2.supports('hide')).toBe(true);

              const backButton3 = new BackButton(false, '6.2');
              expect(backButton3.supports('show')).toBe(true);
              expect(backButton3.supports('hide')).toBe(true);
            });
          });
        });
      });
    });
  });
});
