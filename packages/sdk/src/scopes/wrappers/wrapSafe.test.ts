import { vi, describe, expect, it, afterEach, beforeEach } from 'vitest';

import { resetPackageState, setVersion } from '@test-utils/utils.js';

import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';

afterEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
});

describe('returned function', () => {
  describe('isSupported', () => {
    describe('as mini apps method', () => {
      it('should return true if passed method is supported', () => {
        const fn = wrapSafe('fn', () => null, {
          component: 'cmp',
          isSupported: 'web_app_setup_settings_button',
        });

        setVersion('6.9');
        expect(fn.isSupported()).toBe(false);
        setVersion('6.10');
        expect(fn.isSupported()).toBe(true);
      });
    });

    // describe('as function', () => {
    //   it('should return result of isSupported', () => {
    //     let result = false;
    //     const fn = wrapSafe(() => null, {
    //       component: 'cmp',
    //       method: 'm',
    //       isSupported() {
    //         result = !result;
    //         console.log('called', result);
    //         return result;
    //       }
    //     });
    //
    //     expect(fn.isSupported()).toBe(true);
    //     expect(fn.isSupported()).toBe(false);
    //     expect(fn.isSupported()).toBe(true);
    //   });
    // });
  });

  describe('isAvailable', () => {
    describe('non-TMA', () => {
      it('should return false in browser', () => {
        const fn = wrapSafe('fn', () => null, {
          component: 'cmp',
        });

        expect(fn.isAvailable()).toBe(false);
      });

      it('should return false in server env', () => {
        vi
          .spyOn(window.location, 'href', 'get')
          .mockImplementationOnce(() => {
            return '/?#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D';
          });
        vi.spyOn(global, 'window', 'get').mockImplementationOnce(() => undefined as any);
        expect(
          wrapSafe('fn', () => null, {
            component: 'cmp',
          }).isAvailable(),
        ).toBe(false);
      });
    });

    describe('TMA', () => {
      beforeEach(() => {
        vi
          .spyOn(window.location, 'href', 'get')
          .mockImplementation(() => {
            return '/?#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D';
          });
      });

      it('should return false if SDK is not initialized', () => {
        expect(
          wrapSafe('fn', () => null, {
            component: 'cmp',
          }).isAvailable(),
        ).toBe(false);
      });

      it('should return false if isSupported returned false', () => {
        const fn = wrapSafe('fn', () => null, {
          component: 'cmp',
          isSupported: 'web_app_setup_settings_button',
        });
        setVersion('6');
        expect(fn.isAvailable()).toBe(false);
        setVersion('10');
      });

      it('should return false if isMounted returned false', () => {
        const fn = wrapSafe('fn', () => null, {
          component: 'cmp',
          isMounted: () => false,
        });
        setVersion('10');
        expect(fn.isAvailable()).toBe(false);
      });

      it('should return true if SDK is initialized, isSupported is omitted or returned true as well as isMounted', () => {
        setVersion('10');
        expect(
          wrapSafe('fn', () => null, {
            component: 'cmp',
          }).isAvailable(),
        ).toBe(true);

        expect(
          wrapSafe('fn', () => null, {
            component: 'cmp',
            isSupported: 'web_app_close',
          }).isAvailable(),
        ).toBe(true);

        expect(
          wrapSafe('fn', () => null, {
            component: 'cmp',
            isMounted: () => true,
          }).isAvailable(),
        ).toBe(true);

        expect(
          wrapSafe('fn', () => null, {
            component: 'cmp',
            isSupported: 'web_app_close',
            isMounted: () => true,
          }).isAvailable(),
        ).toBe(true);
      });
    });
  });
});