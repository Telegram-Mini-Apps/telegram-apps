import { Layout } from '../../../src';

describe('components', () => {
  describe('Layout', () => {
    describe('Layout.ts', () => {
      describe('Layout', () => {
        describe('colorScheme', () => {
          it('should return "dark" in case, layout '
            + 'background color is recognized as dark. "light" otherwise', () => {
            const layout = new Layout({ postEvent: jest.fn() } as any, '', 'bg_color', '#000000');

            expect(layout.colorScheme).toBe('dark');
            layout.setBackgroundColor('#ffffff');
            expect(layout.colorScheme).toBe('light');
          });
        });

        describe('setBackgroundColor', () => {
          it('should call "web_app_set_background_color" method '
            + 'with { color: {{color}} }', () => {
            const postEvent = jest.fn();
            const layout = new Layout({ postEvent } as any, '', 'bg_color', '#000000');

            expect(postEvent).toHaveBeenCalledTimes(0);
            layout.setBackgroundColor('#ffaabb');
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_set_background_color', { color: '#ffaabb' });
          });

          it('should emit "backgroundColorChanged" event with specified value', () => {
            const layout = new Layout({ postEvent: jest.fn() } as any, '', 'bg_color', '#000000');
            const listener = jest.fn();

            layout.on('backgroundColorChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            layout.setBackgroundColor('#ffaacc');
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('#ffaacc');
          });
        });

        describe('setHeaderColor', () => {
          it('should call "web_app_set_header_color" method '
            + 'with { color_key: {{color_key}} }', () => {
            const postEvent = jest.fn();
            const layout = new Layout({ postEvent } as any, '', 'bg_color', '#000000');

            expect(postEvent).toHaveBeenCalledTimes(0);
            layout.setHeaderColor('secondary_bg_color');
            expect(postEvent).toHaveBeenCalledTimes(1);
            expect(postEvent).toHaveBeenCalledWith('web_app_set_header_color', { color_key: 'secondary_bg_color' });
          });

          it('should emit "headerColorChanged" event with specified value', () => {
            const layout = new Layout({ postEvent: jest.fn() } as any, '', 'bg_color', '#000000');
            const listener = jest.fn();

            layout.on('headerColorChanged', listener);
            expect(listener).toHaveBeenCalledTimes(0);
            layout.setHeaderColor('secondary_bg_color');
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('secondary_bg_color');
          });
        });

        describe('off', () => {
          describe('"backgroundColorChanged" event', () => {
            it('should remove event listener from event', () => {
              const listener = jest.fn();
              const layout = new Layout({ postEvent: jest.fn() } as any, '', 'bg_color', '#000000');

              layout.on('backgroundColorChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              layout.setBackgroundColor('#aaddcc');
              expect(listener).toHaveBeenCalledTimes(1);

              layout.off('backgroundColorChanged', listener);
              listener.mockClear();

              expect(listener).toHaveBeenCalledTimes(0);
              layout.setBackgroundColor('#ffaaaa');
              expect(listener).toHaveBeenCalledTimes(0);
            });
          });

          describe('"headerColorChanged" event', () => {
            it('should remove event listener from event', () => {
              const listener = jest.fn();
              const layout = new Layout({ postEvent: jest.fn() } as any, '', 'bg_color', '#000000');

              layout.on('headerColorChanged', listener);

              expect(listener).toHaveBeenCalledTimes(0);
              layout.setHeaderColor('secondary_bg_color');
              expect(listener).toHaveBeenCalledTimes(1);

              layout.off('headerColorChanged', listener);
              listener.mockClear();

              expect(listener).toHaveBeenCalledTimes(0);
              layout.setHeaderColor('bg_color');
              expect(listener).toHaveBeenCalledTimes(0);
            });
          });
        });

        describe('supports', () => {
          describe('setHeaderColor / setBackgroundColor', () => {
            it('should return true in case, Layout '
              + 'version is 6.1 or higher. False, otherwise', () => {
              const layout1 = new Layout({} as any, '6.0', 'bg_color', '#000000');
              expect(layout1.supports('setHeaderColor')).toBe(false);
              expect(layout1.supports('setBackgroundColor')).toBe(false);

              const layout2 = new Layout({} as any, '6.1', 'bg_color', '#000000');
              expect(layout2.supports('setHeaderColor')).toBe(true);
              expect(layout2.supports('setBackgroundColor')).toBe(true);

              const layout3 = new Layout({} as any, '6.2', 'bg_color', '#000000');
              expect(layout3.supports('setHeaderColor')).toBe(true);
              expect(layout3.supports('setBackgroundColor')).toBe(true);
            });
          });
        });
      });
    });
  });
});
