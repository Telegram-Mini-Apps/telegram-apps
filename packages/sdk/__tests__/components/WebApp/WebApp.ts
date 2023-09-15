import type { RGB } from '@twa.js/colors';

import { WebApp } from '../../../src/index.js';

import type { CreateRequestIdFunc, PostEvent, WebAppHeaderColor } from '../../../src/index.js';

interface CreateWebAppOptions {
  backgroundColor?: RGB;
  createRequestId?: CreateRequestIdFunc;
  headerColor?: WebAppHeaderColor;
  platform?: string;
  postEvent?: PostEvent;
  version?: string;
}

function createWebApp(options: CreateWebAppOptions = {}): WebApp {
  const {
    createRequestId = jest.fn(),
    postEvent = jest.fn(),
    backgroundColor = '#000000',
    headerColor = 'bg_color',
    version = '6.0',
    platform = 'unknown',
  } = options;

  return new WebApp(headerColor, backgroundColor, version, platform, createRequestId, postEvent);
}

describe('components', () => {
  describe('WebApp', () => {
    describe('WebApp.ts', () => {
      describe('WebApp', () => {
        describe('colorScheme', () => {
          it('should return "dark" in case, WebApp background color is recognized as dark. "light" otherwise', () => {
            const webApp = createWebApp({ backgroundColor: '#000000' });

            expect(webApp.colorScheme).toBe('dark');
            webApp.setBackgroundColor('#ffffff');
            expect(webApp.colorScheme).toBe('light');
          });
        });

        describe('setBackgroundColor', () => {
          it('should call "web_app_set_background_color" method with { color: {{color}} }', () => {
            const postEvent = jest.fn();
            const webApp = createWebApp({ postEvent });

            expect(postEvent).toHaveBeenCalledTimes(0);
            webApp.setBackgroundColor('#ffaabb');
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_set_background_color', { color: '#ffaabb' });
          });

          it('should emit "backgroundColorChanged" event with specified value', () => {
            const webApp = createWebApp({ backgroundColor: '#ffffff' });
            const listener = jest.fn();

            webApp.on('backgroundColorChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            webApp.setBackgroundColor('#ffaacc');
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('#ffaacc');
          });
        });

        describe('setHeaderColor', () => {
          it('should call "web_app_set_header_color" method with { color_key: {{color_key}} }', () => {
            const postEvent = jest.fn();
            const webApp = createWebApp({ postEvent, headerColor: 'bg_color' });

            expect(postEvent).toHaveBeenCalledTimes(0);
            webApp.setHeaderColor('secondary_bg_color');
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_set_header_color', { color_key: 'secondary_bg_color' });
          });

          it('should emit "headerColorChanged" event with specified value', () => {
            const webApp = createWebApp({ headerColor: 'bg_color' });
            const listener = jest.fn();

            webApp.on('headerColorChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            webApp.setHeaderColor('secondary_bg_color');
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('secondary_bg_color');
          });
        });

        describe('off', () => {
          describe('"backgroundColorChanged" event', () => {
            it('should remove event listener from event', () => {
              const listener = jest.fn();
              const webApp = createWebApp({ backgroundColor: '#ffffff' });

              webApp.on('backgroundColorChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              webApp.setBackgroundColor('#aaddcc');
              expect(listener).toHaveBeenCalledTimes(1);

              webApp.off('backgroundColorChanged', listener);
              listener.mockClear();

              expect(listener).toHaveBeenCalledTimes(0);
              webApp.setBackgroundColor('#ffaaaa');
              expect(listener).toHaveBeenCalledTimes(0);
            });
          });

          describe('"headerColorChanged" event', () => {
            it('should remove event listener from event', () => {
              const listener = jest.fn();
              const webApp = createWebApp({ headerColor: 'bg_color' });

              webApp.on('headerColorChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              webApp.setHeaderColor('secondary_bg_color');
              expect(listener).toHaveBeenCalledTimes(1);

              webApp.off('headerColorChanged', listener);
              listener.mockClear();

              expect(listener).toHaveBeenCalledTimes(0);
              webApp.setHeaderColor('bg_color');
              expect(listener).toHaveBeenCalledTimes(0);
            });
          });
        });

        describe('supports', () => {
          describe('setHeaderColor / setBackgroundColor', () => {
            it('should return true in case, WebApp version is 6.1 or higher. False, otherwise', () => {
              const webApp1 = createWebApp({ version: '6.0' });
              expect(webApp1.supports('setHeaderColor')).toBe(false);
              expect(webApp1.supports('setBackgroundColor')).toBe(false);

              const webApp2 = createWebApp({ version: '6.1' });
              expect(webApp2.supports('setHeaderColor')).toBe(true);
              expect(webApp2.supports('setBackgroundColor')).toBe(true);

              const webApp3 = createWebApp({ version: '6.2' });
              expect(webApp3.supports('setHeaderColor')).toBe(true);
              expect(webApp3.supports('setBackgroundColor')).toBe(true);
            });
          });
        });
      });
    });
  });
});
