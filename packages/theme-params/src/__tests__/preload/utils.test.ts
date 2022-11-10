import {
  describe,
  expect,
  jest,
  it,
  beforeAll,
  beforeEach,
  afterEach,
} from '@jest/globals';
import {applyTheme, logError, run} from '../../preload/utils';
import SpiedGetter = jest.SpiedGetter;

let windowSpy: SpiedGetter<Window>;

beforeAll(() => {
  const noop = () => {
  };
  jest.spyOn(document.documentElement.style, 'setProperty').mockImplementation(noop);
  jest.spyOn(console, 'error').mockImplementation(noop);
});

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get');
  jest.clearAllMocks();
});

afterEach(() => {
  windowSpy.mockRestore();
});

describe('preload', () => {
  describe('utils', () => {
    describe('applyTheme', () => {
      it('should ignore non-string properties', () => {
        applyTheme({backgroundColor: '#ffffff', linkColor: undefined});
        expect(document.documentElement.style.setProperty).toHaveBeenCalledTimes(1);
        expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--theme-background-color', '#ffffff');
      });

      it('should set CSS variables with formatted names', () => {
        applyTheme({backgroundColor: '#ffffff', linkColor: '#ff0000'});
        expect(document.documentElement.style.setProperty).toBeCalledTimes(2);
        expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--theme-background-color', '#ffffff');
        expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--theme-link-color', '#ff0000');
      });
    });

    describe('logError', () => {
      it('should call console.error with passed argument', () => {
        const err = new Error();
        logError(err);
        expect(console.error).toHaveBeenCalledWith(
          'An error occurred while setting theme params CSS variables.', err,
        );
      });
    });

    describe('run', () => {
      it(
        'should log error in console in case, location does not contain ' +
        'theme information', () => {
          jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
            addEventListener: jest.fn(),
            TelegramWebviewProxy: {postEvent: jest.fn()},
            location: {hash: '#'},
          } as any));
          run();
          expect(console.error).toHaveBeenCalled();
        },
      );

      it(
        'should set CSS variables in case, location contains theme ' +
        'information', () => {
          jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
            addEventListener: jest.fn(),
            TelegramWebviewProxy: {postEvent: jest.fn()},
            location: {
              hash: '#tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%230f0f0f%22%7D',
            },
          } as any));
          run();

          expect(document.documentElement.style.setProperty).toBeCalledTimes(7);
          expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--theme-background-color', '#212121');
          expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--theme-button-color', '#8774e1');
          expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--theme-button-text-color', '#ffffff');
          expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--theme-secondary-background-color', '#0f0f0f');
          expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--theme-link-color', '#8774e1');
          expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--theme-hint-color', '#aaaaaa');
          expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--theme-text-color', '#ffffff');
        },
      );

      // FIXME
      // it('should start listening for theme changes and apply them', () => {
      //   jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
      //     addEventListener: jest.fn(),
      //     TelegramWebviewProxy: {postEvent: jest.fn()},
      //     location: {
      //       hash: '#tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%230f0f0f%22%7D',
      //     },
      //   } as any));
      //
      //   run();
      //   (document.documentElement.style.setProperty as MockedFunction<typeof document.documentElement.style.setProperty>).mockClear();
      //
      //   emitDesktopEvent('theme_changed', {
      //     theme_params: {
      //       bg_color: '#212121',
      //       button_color: '#8774e1',
      //     },
      //   });
      //
      //   expect(spy).toHaveBeenCalledTimes(2);
      //   expect(spy).toHaveBeenCalledWith('--theme-background-color', '#212121');
      //   expect(spy).toHaveBeenCalledWith('--theme-button-color', '#8774e1');
      // });
      //
      // it(
      //   'should log error in case, received theme through event ' +
      //   'has incorrect form', () => {
      //     const spy = jest.spyOn(console, 'error').mockImplementation(() => {
      //     });
      //     run();
      //     spy.mockClear();
      //     emitDesktopEvent('theme_changed', {theme_params: {bg_color: 123}});
      //     expect(spy).toHaveBeenCalled();
      //   },
      // );
    });
  });
});