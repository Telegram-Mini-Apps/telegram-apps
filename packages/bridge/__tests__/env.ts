import { hasExternal, hasNotify, hasInvoke, isIframe } from '../src';

const windowSpy = jest.spyOn(window, 'window', 'get');

afterEach(() => {
  windowSpy.mockReset();
});

describe('env.ts', () => {
  describe('hasExternal', () => {
    it('should return true if passed object contains object '
      + 'property "external". Otherwise, false.', () => {
      expect(hasExternal({ external: {} })).toBe(true);
      expect(hasExternal({ external: [] })).toBe(false);
      expect(hasExternal({})).toBe(false);
    });
  });

  describe('hasNotify', () => {
    it('should return true if passed object contains function '
      + 'property "notify". Otherwise, false.', () => {
      expect(hasNotify({
        notify: () => {
        },
      })).toBe(true);
      expect(hasNotify({ notify: {} })).toBe(false);
      expect(hasNotify({})).toBe(false);
    });
  });

  describe('hasInvoke', () => {
    it('should return true if passed object contains function '
      + 'property "invoke". Otherwise, false.', () => {
      expect(hasInvoke({
        invoke: () => {
        },
      })).toBe(true);
      expect(hasInvoke({ invoke: {} })).toBe(false);
      expect(hasInvoke({})).toBe(false);
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
