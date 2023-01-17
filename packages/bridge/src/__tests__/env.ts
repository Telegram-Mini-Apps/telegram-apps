import {beforeEach, describe, expect, it} from '@jest/globals';
import {isBrowserEnv, hasTelegramWebviewProxy, hasExternalNotify} from '../env';

beforeEach(() => {
  const wnd = window as any;
  delete wnd.TelegramWebviewProxy;
  delete wnd.external;
  Object.defineProperty(window, 'top', {value: window.self});
});

describe('env', () => {
  describe('hasTelegramWebviewProxy', () => {
    it(
      'should return true in case, window has "TelegramWebviewProxy" property',
      () => {
        (window as any).TelegramWebviewProxy = {};
        expect(hasTelegramWebviewProxy(window)).toBe(true);
      },
    );

    it(
      'should return false in case, window has no "TelegramWebviewProxy" property',
      () => {
        expect(hasTelegramWebviewProxy(window)).toBe(false);
      },
    );
  });

  describe('hasExternalNotify', () => {
    it(
      'should return true in case, path value ' +
      '"window.external.notify" is function',
      () => {
        (window as any).external = {
          notify: () => {
          },
        };
        expect(hasExternalNotify(window)).toBe(true);
      },
    );

    it(
      'should return false in case, path value ' +
      '"window.external.notify" is not function',
      () => {
        expect(hasExternalNotify(window)).toBe(false);
      },
    );
  });

  describe('isBrowserEnv', () => {
    // FIXME
    // it('should return true in case, parent window is not current one', () => {
    //   Object.defineProperty(window, 'top', {value: null})
    //   expect(isBrowserEnv()).toBe(true);
    // });

    it('should return false in case, parent window is current one', () => {
      expect(isBrowserEnv()).toBe(false);
    });
  })
});