import { hasExternalNotify, hasWebviewProxy, isIframe } from '../src/index.js';

const windowSpy = jest.spyOn(window, 'window', 'get');
const emptyFunction = () => {
};

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('env.ts', () => {
  describe('hasExternalNotify', () => {
    it('should return true if passed object contains path property "external.notify" and "notify" is a function property.', () => {
      expect(hasExternalNotify({})).toBe(false);
      expect(hasExternalNotify({ external: {} })).toBe(false);
      expect(hasExternalNotify({ external: { notify: [] } })).toBe(false);
      expect(hasExternalNotify({ external: { notify: emptyFunction } })).toBe(true);
    });
  });

  describe('hasWebviewProxy', () => {
    it('should return true if passed object contains path property "TelegramWebviewProxy.postEvent" and "postEvent" is a function property.', () => {
      expect(hasWebviewProxy({})).toBe(false);
      expect(hasWebviewProxy({ TelegramWebviewProxy: {} })).toBe(false);
      expect(hasWebviewProxy({ TelegramWebviewProxy: { postEvent: [] } })).toBe(false);
      expect(hasWebviewProxy({ TelegramWebviewProxy: { postEvent: emptyFunction } })).toBe(true);
    });
  });

  describe('isIframe', () => {
    it('should return true in case window.self !== window.top. Otherwise, false.', () => {
      windowSpy.mockImplementation(() => ({ self: 900, top: 1000 }) as any);
      expect(isIframe()).toBe(true);

      windowSpy.mockImplementation(() => ({ self: 900, top: 900 }) as any);
      expect(isIframe()).toBe(false);
    });

    it('should return true in case window.self getter threw an error', () => {
      windowSpy.mockImplementation(() => ({
        get self() {
          throw new Error();
        },
      }) as any);
      expect(isIframe()).toBe(true);
    });
  });
});
