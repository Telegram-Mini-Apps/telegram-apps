import type { SpyInstance } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toSearchParams } from 'test-utils';

import { computeLaunchData } from '../src/index.js';

/**
 * Mocks session storage launch params.
 */
function mockSessionStorageLaunchParams(launchParams: string) {
  vi
    .spyOn(sessionStorage, 'getItem')
    .mockImplementation(() => launchParams);
}

/**
 * Mocks performance to make it imitate page reload.
 */
function mockPageReload() {
  if (!vi.isMockFunction(performance.getEntriesByType)) {
    vi
      .spyOn(performance, 'getEntriesByType')
      .mockImplementation(() => [{ type: 'reload' }] as any);
    return;
  }

  const asMock = performance.getEntriesByType as unknown as SpyInstance;
  const implementation = asMock.getMockImplementation();

  asMock.mockImplementation(() => {
    const values = implementation ? implementation() : [];

    if (values.length > 0) {
      values[0].type = 'reload';
    } else {
      values.push({ type: 'reload' });
    }

    return values;
  });
}

/**
 * Mocks location launch params.
 */
function mockLocationLaunchParams(launchParams: string) {
  vi
    .spyOn(window.location, 'hash', 'get')
    .mockImplementation(() => `#${launchParams}`);
}

/**
 * Mocks performance launch params.
 */
function mockPerformanceLaunchParams(launchParams: string) {
  if (!vi.isMockFunction(performance.getEntriesByType)) {
    vi
      .spyOn(performance, 'getEntriesByType')
      .mockImplementation(() => [{ name: `#${launchParams}` }] as any);
    return;
  }

  const asMock = performance.getEntriesByType as unknown as SpyInstance;
  const implementation = asMock.getMockImplementation();

  asMock.mockImplementation(() => {
    const values = implementation ? implementation() : [];

    if (values.length > 0) {
      values[0].name = `#${launchParams}`;
    } else {
      values.push({ name: `#${launchParams}` });
    }

    return values;
  });
}

/**
 * Mocks current window object such way, it makes script think it is currently being launched
 * in iframe.
 */
function mockIframe() {
  vi
    .spyOn(window, 'top', 'get')
    .mockImplementation(() => {
      throw new Error('access violation');
    });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('computeLaunchData', () => {
  describe('launch parameters from the session storage extracted', () => {
    describe('launch parameters from location extracted', () => {
      describe('iframe environment', () => {
        it('should return launch parameters from location and true, if page was reloaded', () => {
          mockIframe();
          mockSessionStorageLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppVersion: '6.0',
            tgWebAppPlatform: 'web',
          }));
          mockLocationLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppVersion: '7.0',
            tgWebAppPlatform: 'macos',
          }));
          mockPageReload();

          expect(computeLaunchData()).toStrictEqual({
            launchParams: {
              themeParams: {},
              version: '7.0',
              platform: 'macos',
            },
            isPageReload: true,
          });
        });

        it('should return launch parameters from location and true, if location launch parameters init data hash is the same as in the session storage launch parameters', () => {
          mockIframe();
          mockSessionStorageLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppData: toSearchParams({
              auth_date: 333,
              hash: 'abc',
            }),
            tgWebAppVersion: '6.0',
            tgWebAppPlatform: 'web',
          }));
          mockLocationLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppData: toSearchParams({
              auth_date: 333,
              hash: 'abc',
            }),
            tgWebAppVersion: '7.0',
            tgWebAppPlatform: 'macos',
          }));

          expect(computeLaunchData()).toStrictEqual({
            launchParams: {
              initData: {
                authDate: new Date(333000),
                hash: 'abc',
              },
              initDataRaw: 'auth_date=333&hash=abc',
              themeParams: {},
              version: '7.0',
              platform: 'macos',
            },
            isPageReload: true,
          });
        });

        it('should return launch parameters from location and false, if location launch parameters init data hash differs from the session storage launch parameters', () => {
          mockIframe();
          mockSessionStorageLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppData: toSearchParams({
              auth_date: 1,
              hash: 'aaa',
            }),
            tgWebAppVersion: '6.0',
            tgWebAppPlatform: 'web',
          }));
          mockLocationLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppData: toSearchParams({
              auth_date: 333,
              hash: 'bbb',
            }),
            tgWebAppVersion: '7.0',
            tgWebAppPlatform: 'macos',
          }));

          expect(computeLaunchData()).toStrictEqual({
            launchParams: {
              initData: {
                authDate: new Date(333000),
                hash: 'bbb',
              },
              initDataRaw: 'auth_date=333&hash=bbb',
              themeParams: {},
              version: '7.0',
              platform: 'macos',
            },
            isPageReload: false,
          });
        });
      });

      describe('non-iframe environment', () => {
        it('should return launch parameters from location and true', () => {
          mockSessionStorageLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppVersion: '6.0',
            tgWebAppPlatform: 'web',
          }));
          mockLocationLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppVersion: '7.0',
            tgWebAppPlatform: 'macos',
          }));

          expect(computeLaunchData()).toStrictEqual({
            launchParams: {
              themeParams: {},
              version: '7.0',
              platform: 'macos',
            },
            isPageReload: true,
          });
        });
      });
    });

    describe('launch parameters from performance extracted', () => {
      describe('iframe environment', () => {
        it('should return launch parameters from performance and true, if page was reloaded', () => {
          mockIframe();
          mockSessionStorageLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppVersion: '6.0',
            tgWebAppPlatform: 'web',
          }));
          mockPerformanceLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppVersion: '7.0',
            tgWebAppPlatform: 'macos',
          }));
          mockPageReload();

          expect(computeLaunchData()).toStrictEqual({
            launchParams: {
              themeParams: {},
              version: '7.0',
              platform: 'macos',
            },
            isPageReload: true,
          });
        });

        it('should return launch parameters from performance and true, if performance launch parameters init data hash is the same as in the session storage launch parameters', () => {
          mockIframe();
          mockSessionStorageLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppData: toSearchParams({
              auth_date: 333,
              hash: 'abc',
            }),
            tgWebAppVersion: '6.0',
            tgWebAppPlatform: 'web',
          }));
          mockPerformanceLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppData: toSearchParams({
              auth_date: 333,
              hash: 'abc',
            }),
            tgWebAppVersion: '7.0',
            tgWebAppPlatform: 'macos',
          }));

          expect(computeLaunchData()).toStrictEqual({
            launchParams: {
              initData: {
                authDate: new Date(333000),
                hash: 'abc',
              },
              initDataRaw: 'auth_date=333&hash=abc',
              themeParams: {},
              version: '7.0',
              platform: 'macos',
            },
            isPageReload: true,
          });
        });

        it('should return launch parameters from performance and false, if performance launch parameters init data hash differs from the session storage launch parameters', () => {
          mockIframe();
          mockSessionStorageLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppData: toSearchParams({
              auth_date: 1,
              hash: 'aaa',
            }),
            tgWebAppVersion: '6.0',
            tgWebAppPlatform: 'web',
          }));
          mockPerformanceLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppData: toSearchParams({
              auth_date: 333,
              hash: 'bbb',
            }),
            tgWebAppVersion: '7.0',
            tgWebAppPlatform: 'macos',
          }));

          expect(computeLaunchData()).toStrictEqual({
            launchParams: {
              initData: {
                authDate: new Date(333000),
                hash: 'bbb',
              },
              initDataRaw: 'auth_date=333&hash=bbb',
              themeParams: {},
              version: '7.0',
              platform: 'macos',
            },
            isPageReload: false,
          });
        });
      });

      describe('non-iframe environment', () => {
        it('should return launch parameters from performance and true', () => {
          mockSessionStorageLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppVersion: '6.0',
            tgWebAppPlatform: 'web',
          }));
          mockPerformanceLaunchParams(toSearchParams({
            tgWebAppThemeParams: {},
            tgWebAppVersion: '7.0',
            tgWebAppPlatform: 'macos',
          }));

          expect(computeLaunchData()).toStrictEqual({
            launchParams: {
              themeParams: {},
              version: '7.0',
              platform: 'macos',
            },
            isPageReload: true,
          });
        });
      });
    });

    describe('launch parameters from location and performance are missing', () => {
      it('should return launch parameters from the session storage and true if page was reloaded', () => {
        mockPageReload();
        mockSessionStorageLaunchParams(toSearchParams({
          tgWebAppThemeParams: {},
          tgWebAppData: toSearchParams({
            auth_date: 333,
            hash: 'abc',
          }),
          tgWebAppVersion: '7.0',
          tgWebAppPlatform: 'macos',
        }));
        expect(computeLaunchData()).toStrictEqual({
          launchParams: {
            initData: {
              authDate: new Date(333000),
              hash: 'abc',
            },
            initDataRaw: 'auth_date=333&hash=abc',
            themeParams: {},
            version: '7.0',
            platform: 'macos',
          },
          isPageReload: true,
        });
      });

      it('should throw if page was not reloaded', () => {
        mockSessionStorageLaunchParams(toSearchParams({
          tgWebAppThemeParams: {},
          tgWebAppVersion: '7.0',
          tgWebAppPlatform: 'macos',
        }));
        expect(() => computeLaunchData()).toThrow('Unable to retrieve current launch parameters, which must exist.');
      });
    });
  });

  describe('launch parameters from the session storage are missing', () => {
    it('should return launch parameters from location if they exist and false', () => {
      mockLocationLaunchParams(toSearchParams({
        tgWebAppThemeParams: {},
        tgWebAppVersion: '6.0',
        tgWebAppPlatform: 'web',
      }));
      expect(computeLaunchData()).toStrictEqual({
        launchParams: {
          themeParams: {},
          version: '6.0',
          platform: 'web',
        },
        isPageReload: false,
      });
    });

    it('should return launch parameters from performance if they exist and false', () => {
      mockPerformanceLaunchParams(toSearchParams({
        tgWebAppThemeParams: {},
        tgWebAppVersion: '6.0',
        tgWebAppPlatform: 'web',
      }));
      expect(computeLaunchData()).toStrictEqual({
        launchParams: {
          themeParams: {},
          version: '6.0',
          platform: 'web',
        },
        isPageReload: false,
      });
    });

    it('should throw error in case, function was unable to extract any launch parameters', () => {
      expect(() => computeLaunchData()).toThrow('Unable to retrieve any launch parameters.');
    });
  });
});
