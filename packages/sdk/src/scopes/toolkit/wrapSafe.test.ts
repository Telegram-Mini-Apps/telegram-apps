import { vi, describe, expect, it, afterEach, beforeEach } from 'vitest';

import { resetPackageState } from '@test-utils/reset/reset.js';

import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { $version } from '@/scopes/globals.js';

afterEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
});

describe('returned function', () => {
  describe('isSupported', () => {
    describe('as mini apps method', () => {
      it('should return true if passed method is supported', () => {
        const fn = wrapSafe(() => null, {
          component: 'cmp',
          method: 'm',
          isSupported: 'web_app_setup_settings_button',
        });

        $version.set('6.9');
        expect(fn.isSupported()).toBe(false);
        $version.set('6.10');
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
        const fn = wrapSafe(() => null, {
          component: 'cmp',
          method: 'm',
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
          wrapSafe(() => null, {
            component: 'cmp',
            method: 'm',
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
          wrapSafe(() => null, {
            component: 'cmp',
            method: 'm',
          }).isAvailable(),
        ).toBe(false);
      });

      it('should return false if isSupported returned false', () => {
        const fn = wrapSafe(() => null, {
          component: 'cmp',
          method: 'm',
          isSupported: 'web_app_setup_settings_button',
        });
        $version.set('6');
        expect(fn.isAvailable()).toBe(false);
        $version.set('10');
      });

      it('should return false if isMounted returned false', () => {
        const fn = wrapSafe(() => null, {
          component: 'cmp',
          method: 'm',
          isMounted: () => false,
        });
        $version.set('10');
        expect(fn.isAvailable()).toBe(false);
      });

      it('should return true if SDK is initialized, isSupported is omitted or returned true as well as isMounted', () => {
        $version.set('10');
        expect(
          wrapSafe(() => null, {
            component: 'cmp',
            method: 'm',
          }).isAvailable()
        ).toBe(true);

        expect(
          wrapSafe(() => null, {
            component: 'cmp',
            method: 'm',
            isSupported: 'web_app_close'
          }).isAvailable()
        ).toBe(true);

        expect(
          wrapSafe(() => null, {
            component: 'cmp',
            method: 'm',
            isMounted: () => true
          }).isAvailable()
        ).toBe(true);

        expect(
          wrapSafe(() => null, {
            component: 'cmp',
            method: 'm',
            isSupported: 'web_app_close',
            isMounted: () => true
          }).isAvailable()
        ).toBe(true);
      });
    });
  });
});