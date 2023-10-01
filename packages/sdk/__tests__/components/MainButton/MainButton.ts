import { expect, test, vi } from 'vitest';

import { MainButton } from '../../../src/index.js';

test('components', () => {
  test('MainButton', () => {
    test('MainButton.ts', () => {
      test('MainButton', () => {
        test('disable', () => {
         test('should call "web_app_setup_main_button" method with parameter where "is_active" property equal to false', () => {
            const postEvent = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', postEvent);
            mainButton.setText('TEST');
            mainButton.enable();
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.disable();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_active', false);
          });

         test('should emit "isEnabledChanged" event with false value', () => {
            const listener = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', vi.fn());
            mainButton.setText('TEST');
            mainButton.enable();

            mainButton.on('isEnabledChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.disable();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        test('enable', () => {
         test('should call "web_app_setup_main_button" method with parameter where "is_active" property equal to true', () => {
            const postEvent = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', postEvent);
            mainButton.setText('TEST');
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.enable();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_active', true);
          });

         test('should emit "isEnabledChanged" event with true value', () => {
            const listener = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', vi.fn());
            mainButton.setText('TEST');

            mainButton.on('isEnabledChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.enable();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        test('hide', () => {
         test('should call "web_app_setup_main_button" method with parameter where "is_visible" property equal to false', () => {
            const postEvent = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', postEvent);
            mainButton.setText('TEST');
            mainButton.show();
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.hide();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_visible', false);
          });

         test('should emit "isVisibleChanged" event with false value', () => {
            const listener = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', vi.fn());
            mainButton.setText('TEST');
            mainButton.show();

            mainButton.on('isVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.hide();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        test('hideProgress', () => {
         test('should call "web_app_setup_main_button" method with parameter where "is_progress_visible" property equal to false', () => {
            const postEvent = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', postEvent);
            mainButton.setText('TEST');
            mainButton.showProgress();
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.hideProgress();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_progress_visible', false);
          });

         test('should emit "isProgressVisibleChanged" event with false value', () => {
            const listener = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', vi.fn());
            mainButton.setText('TEST');
            mainButton.showProgress();

            mainButton.on('isProgressVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.hideProgress();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        test('show', () => {
         test('should call "web_app_setup_main_button" method with parameter where "is_visible" property equal to true', () => {
            const postEvent = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', postEvent);
            mainButton.setText('TEST');
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.show();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_visible', true);
          });

         test('should emit "isVisibleChanged" event with true value', () => {
            const listener = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', vi.fn());
            mainButton.setText('TEST');

            mainButton.on('isVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.show();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        test('showProgress', () => {
         test('should call "web_app_setup_main_button" method with parameter where "is_progress_visible" property equal to true', () => {
            const postEvent = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', postEvent);
            mainButton.setText('TEST');
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.showProgress();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_progress_visible', true);
          });

         test('should emit "isProgressVisibleChanged" event with true value', () => {
            const listener = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', vi.fn());
            mainButton.setText('TEST');

            mainButton.on('isProgressVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.showProgress();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        test('setText', () => {
         test('should call "web_app_setup_main_button" method with parameter where "text" property equal to specified value', () => {
            const postEvent = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', postEvent);

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.setText('WOW');
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('text', 'WOW');
          });

         test('should emit "textChanged" event with specified value', () => {
            const listener = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', vi.fn());

            mainButton.on('textChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.setText('Punch');
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('Punch');
          });
        });

        test('setTextColor', () => {
         test('should call "web_app_setup_main_button" method with parameter where "text_color" property equal to specified value', () => {
            const postEvent = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', postEvent);
            mainButton.setText('TEST');
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.setTextColor('#ffaacc');
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('text_color', '#ffaacc');
          });

         test('should emit "textColorChanged" event with specified value', () => {
            const listener = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', vi.fn());
            mainButton.setText('TEST');

            mainButton.on('textColorChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.setTextColor('#aaaaaa');
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('#aaaaaa');
          });
        });

        test('setColor', () => {
         test('should call "web_app_setup_main_button" method with parameter where "color" property equal to specified value', () => {
            const postEvent = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', postEvent);
            mainButton.setText('TEST');
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.setBackgroundColor('#ffaacc');
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('color', '#ffaacc');
          });

         test('should emit "backgroundColorChanged" event with specified value', () => {
            const listener = vi.fn();
            const mainButton = new MainButton('#000000', false, false, false, '', '#ffffff', vi.fn());
            mainButton.setText('TEST');

            mainButton.on('backgroundColorChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.setBackgroundColor('#aaaaaa');
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('#aaaaaa');
          });
        });
      });
    });
  });
});
