import { WebApp } from '../../../src';

describe('components', () => {
  describe('WebApp', () => {
    describe('WebApp.ts', () => {
      describe('WebApp', () => {
        describe('colorScheme', () => {
          it('should return "dark" in case, WebApp '
            + 'background color is recognized as dark. "light" otherwise', () => {
            const webApp = new WebApp('', '', 'bg_color', '#000000', jest.fn());

            expect(webApp.colorScheme).toBe('dark');
            webApp.backgroundColor = '#ffffff';
            expect(webApp.colorScheme).toBe('light');
          });
        });

        describe('setBackgroundColor', () => {
          it('should call "web_app_set_background_color" method '
            + 'with { color: {{color}} }', () => {
            const postEvent = jest.fn();
            const webApp = new WebApp('', '', 'bg_color', '#000000', postEvent);

            expect(postEvent).toHaveBeenCalledTimes(0);
            webApp.backgroundColor = '#ffaabb';
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_set_background_color', { color: '#ffaabb' });
          });

          it('should emit "backgroundColorChanged" event with specified value', () => {
            const webApp = new WebApp('', '', 'bg_color', '#000000', jest.fn());
            const listener = jest.fn();

            webApp.on('backgroundColorChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            webApp.backgroundColor = '#ffaacc';
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('#ffaacc');
          });
        });

        describe('setHeaderColor', () => {
          it('should call "web_app_set_header_color" method with { color_key: {{color_key}} }', () => {
            const postEvent = jest.fn();
            const webApp = new WebApp('', '', 'bg_color', '#000000', postEvent);

            expect(postEvent).toHaveBeenCalledTimes(0);
            webApp.headerColor = 'secondary_bg_color';
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_set_header_color', { color_key: 'secondary_bg_color' });
          });

          it('should emit "headerColorChanged" event with specified value', () => {
            const webApp = new WebApp('', '', 'bg_color', '#000000', jest.fn());
            const listener = jest.fn();

            webApp.on('headerColorChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            webApp.headerColor = 'secondary_bg_color';
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('secondary_bg_color');
          });
        });

        describe('off', () => {
          describe('"backgroundColorChanged" event', () => {
            it('should remove event listener from event', () => {
              const listener = jest.fn();
              const webApp = new WebApp('', '', 'bg_color', '#000000', jest.fn());

              webApp.on('backgroundColorChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              webApp.backgroundColor = '#aaddcc';
              expect(listener).toHaveBeenCalledTimes(1);

              webApp.off('backgroundColorChanged', listener);
              listener.mockClear();

              expect(listener).toHaveBeenCalledTimes(0);
              webApp.backgroundColor = '#ffaaaa';
              expect(listener).toHaveBeenCalledTimes(0);
            });
          });

          describe('"headerColorChanged" event', () => {
            it('should remove event listener from event', () => {
              const listener = jest.fn();
              const webApp = new WebApp('', '', 'bg_color', '#000000', jest.fn());

              webApp.on('headerColorChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              webApp.headerColor = 'secondary_bg_color';
              expect(listener).toHaveBeenCalledTimes(1);

              webApp.off('headerColorChanged', listener);
              listener.mockClear();

              expect(listener).toHaveBeenCalledTimes(0);
              webApp.headerColor = 'bg_color';
              expect(listener).toHaveBeenCalledTimes(0);
            });
          });
        });

        describe('supports', () => {
          describe('setHeaderColor / setBackgroundColor', () => {
            it('should return true in case, WebApp '
              + 'version is 6.1 or higher. False, otherwise', () => {
              const webApp1 = new WebApp('6.0', '', 'bg_color', '#000000', jest.fn());
              expect(webApp1.supports('setHeaderColor')).toBe(false);
              expect(webApp1.supports('setBackgroundColor')).toBe(false);

              const webApp2 = new WebApp('6.1', '', 'bg_color', '#000000', jest.fn());
              expect(webApp2.supports('setHeaderColor')).toBe(true);
              expect(webApp2.supports('setBackgroundColor')).toBe(true);

              const webApp3 = new WebApp('6.2', '', 'bg_color', '#000000', jest.fn());
              expect(webApp3.supports('setHeaderColor')).toBe(true);
              expect(webApp3.supports('setBackgroundColor')).toBe(true);
            });
          });
        });
      });
    });
  });
});
