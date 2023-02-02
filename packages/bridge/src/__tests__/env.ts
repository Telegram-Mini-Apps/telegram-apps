import {afterEach, describe, expect, it, jest} from '@jest/globals';
import {isBrowserEnv, hasTelegramWebviewProxy, hasExternalNotify} from '../env';

let windowSpy = jest.spyOn(window, 'window', 'get');

afterEach(() => {
  windowSpy.mockReset();
});

describe('env', () => {
  describe('hasTelegramWebviewProxy', () => {
    it('should return true in case, window has ' +
      '"TelegramWebviewProxy" property', () => {
      windowSpy.mockImplementation(() => ({TelegramWebviewProxy: null}) as any);
      expect(hasTelegramWebviewProxy(window)).toBe(true);
    });

    it('should return false in case, window has no ' +
      '"TelegramWebviewProxy" property', () => {
      windowSpy.mockImplementation(() => ({}) as any);
      expect(hasTelegramWebviewProxy(window)).toBe(false);
    });
  });

  describe('hasExternalNotify', () => {
    it('should return true in case, path value ' +
      '"window.external.notify" is function', () => {
      windowSpy.mockImplementation(() => ({external: {notify: () => null}}) as any);
      expect(hasExternalNotify(window)).toBe(true);
    });

    it('should return false in case, path value ' +
      '"window.external.notify" is not function', () => {
      windowSpy.mockImplementation(() => ({}) as any);
      expect(hasExternalNotify(window)).toBe(false);
    });
  });

  describe('isBrowserEnv', () => {
    it('should return true in case window.self !== window.top', () => {
      windowSpy.mockImplementation(() => ({self: 900, top: 1000}) as any);
      expect(isBrowserEnv()).toBe(true);
    });

    it('should return true in case window.self getter threw an error', () => {
      windowSpy.mockImplementation(() => ({
        get self() {
          throw new Error();
        },
      }) as any);
      expect(isBrowserEnv()).toBe(true);
    });

    it('should return false in case window.self === window.top', () => {
      windowSpy.mockImplementation(() => ({self: 900, top: 900}) as any);
      expect(isBrowserEnv()).toBe(false);
    });
  });
});