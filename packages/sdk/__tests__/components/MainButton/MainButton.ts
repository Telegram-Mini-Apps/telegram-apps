import {describe, expect, it, jest} from '@jest/globals';
import {MainButton} from '../../../src';

describe('components', () => {
  describe('MainButton', () => {
    describe('MainButton.ts', () => {
      describe('MainButton', () => {
        describe('disable', () => {
          it('should call "web_app_setup_main_button" method ' +
            'with parameter where "is_active" property equal to false', () => {
            const postEvent = jest.fn();
            const mainButton = new MainButton({postEvent} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            mainButton.enable();
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.disable();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_active', false);
          });

          it('should emit "isActiveChanged" event with false value', () => {
            const listener = jest.fn();
            const mainButton = new MainButton({postEvent: jest.fn()} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            mainButton.enable();

            mainButton.on('isActiveChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.disable();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        describe('enable', () => {
          it('should call "web_app_setup_main_button" method ' +
            'with parameter where "is_active" property equal to true', () => {
            const postEvent = jest.fn();
            const mainButton = new MainButton({postEvent} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.enable();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_active', true);
          });

          it('should emit "isActiveChanged" event with true value', () => {
            const listener = jest.fn();
            const mainButton = new MainButton({postEvent: jest.fn()} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');

            mainButton.on('isActiveChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.enable();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        describe('hide', () => {
          it('should call "web_app_setup_main_button" method ' +
            'with parameter where "is_visible" property equal to false', () => {
            const postEvent = jest.fn();
            const mainButton = new MainButton({postEvent} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            mainButton.show();
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.hide();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_visible', false);
          });

          it('should emit "isVisibleChanged" event with false value', () => {
            const listener = jest.fn();
            const mainButton = new MainButton({postEvent: jest.fn()} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            mainButton.show();

            mainButton.on('isVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.hide();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        describe('hideProgress', () => {
          it('should call "web_app_setup_main_button" method ' +
            'with parameter where "is_progress_visible" property equal to false', () => {
            const postEvent = jest.fn();
            const mainButton = new MainButton({postEvent} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            mainButton.showProgress();
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.hideProgress();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_progress_visible', false);
          });

          it('should emit "isProgressVisibleChanged" event with false value', () => {
            const listener = jest.fn();
            const mainButton = new MainButton({postEvent: jest.fn()} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            mainButton.showProgress();

            mainButton.on('isProgressVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.hideProgress();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(false);
          });
        });

        describe('show', () => {
          it('should call "web_app_setup_main_button" method ' +
            'with parameter where "is_visible" property equal to true', () => {
            const postEvent = jest.fn();
            const mainButton = new MainButton({postEvent} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.show();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_visible', true);
          });

          it('should emit "isVisibleChanged" event with true value', () => {
            const listener = jest.fn();
            const mainButton = new MainButton({postEvent: jest.fn()} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');

            mainButton.on('isVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.show();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        describe('showProgress', () => {
          it('should call "web_app_setup_main_button" method ' +
            'with parameter where "is_progress_visible" property equal to true', () => {
            const postEvent = jest.fn();
            const mainButton = new MainButton({postEvent} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.showProgress();
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('is_progress_visible', true);
          });

          it('should emit "isProgressVisibleChanged" event with true value', () => {
            const listener = jest.fn();
            const mainButton = new MainButton({postEvent: jest.fn()} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');

            mainButton.on('isProgressVisibleChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.showProgress();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(true);
          });
        });

        describe('setText', () => {
          it('should call "web_app_setup_main_button" method ' +
            'with parameter where "text" property equal to specified value', () => {
            const postEvent = jest.fn();
            const mainButton = new MainButton({postEvent} as any, '#000000', '#ffffff');

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.setText('WOW');
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('text', 'WOW');
          });

          it('should emit "textChanged" event with specified value', () => {
            const listener = jest.fn();
            const mainButton = new MainButton({postEvent: jest.fn()} as any, '#000000', '#ffffff');

            mainButton.on('textChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.setText('Punch');
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('Punch');
          });
        });

        describe('setTextColor', () => {
          it('should call "web_app_setup_main_button" method ' +
            'with parameter where "text_color" property equal to specified value', () => {
            const postEvent = jest.fn();
            const mainButton = new MainButton({postEvent} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.setTextColor('#ffaacc');
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('text_color', '#ffaacc');
          });

          it('should emit "textColorChanged" event with specified value', () => {
            const listener = jest.fn();
            const mainButton = new MainButton({postEvent: jest.fn()} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');

            mainButton.on('textColorChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.setTextColor('#aaaaaa');
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('#aaaaaa');
          });
        });

        describe('setColor', () => {
          it('should call "web_app_setup_main_button" method ' +
            'with parameter where "color" property equal to specified value', () => {
            const postEvent = jest.fn();
            const mainButton = new MainButton({postEvent} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');
            postEvent.mockClear();

            expect(postEvent).toHaveBeenCalledTimes(0);
            mainButton.setColor('#ffaacc');
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
            expect(postEvent.mock.calls[0][1]).toHaveProperty('color', '#ffaacc');
          });

          it('should emit "colorChanged" event with specified value', () => {
            const listener = jest.fn();
            const mainButton = new MainButton({postEvent: jest.fn()} as any, '#000000', '#ffffff');
            mainButton.setText('TEST');

            mainButton.on('colorChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            mainButton.setColor('#aaaaaa');
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('#aaaaaa');
          });
        });
      });
    });
  });
});