import { beforeEach, describe, expect, it, vi } from 'vitest';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import { mount, expand, bindCssVars, exitFullscreen, requestFullscreen } from './methods.js';
import { isMounted, isFullscreen, isExpanded, width, height, stableHeight } from './signals.js';
import { mockMiniAppsEnv } from "@test-utils/mockMiniAppsEnv.js";
import { setMaxVersion } from "@test-utils/setMaxVersion.js";
import { mockPageReload, mockSessionStorageGetItem } from "test-utils";

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe.each([
  ['mount', mount, undefined, undefined],
  ['expand', expand, undefined, undefined],
  ['bindCssVars', bindCssVars, isMounted, undefined],
  ['exitFullscreen', exitFullscreen, isMounted, '8.0'],
  ['requestFullscreen', requestFullscreen, isMounted, '8.0'],
] as const)('%s', (name, fn, isMounted, minVersion) => {
  testSafety(fn, name, {
    component: 'viewport',
    minVersion,
    isMounted,
  });
});

describe('mount', () => {
  beforeEach(() => {
    mockMiniAppsEnv();
    setMaxVersion();
  });

  it('should set isMounted = true', () => {
    expect(isMounted()).toBe(false);
    mount()
      .then(() => expect(isMounted()).toBe(true))
      .catch((err) => expect(err).toBe(""));
  });

  describe('page reload', () => {
    beforeEach(() => {
      mockPageReload();
    });

    it('should use values from session storage key "tapps/viewport"', () => {
      const storageState = {
        isExpanded: true,
        isFullscreen: true,
        height: 1000,
        width: 2000,
        stableHeight: 1000,
      }
      const spy = mockSessionStorageGetItem(() =>
        JSON.stringify(storageState));
      mount()
        .then((state) => {
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith('tapps/viewport');
          expect(state).toEqual(storageState);
        })
        .catch((err) => console.error(err))
        .finally(() => {
          const actualState = {
            isExpanded: isExpanded(),
            isFullscreen: isFullscreen(),
            height: height(),
            width: width(),
            stableHeight: stableHeight(),
          }
          expect(actualState).toEqual(storageState);
        });
    });

    it('should set isFullScreen false if session storage key "tapps/viewport" not presented', () => {
      const spy = mockSessionStorageGetItem(() => null);
      mount()
        .then((state) => {
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith('tapps/viewport');
          expect(state.isFullscreen).toBe(false);
        })
        .catch((err) => expect(err).toBe(""))
        .finally(() => expect(isFullscreen()).toBe(false));
    });

    it('should set isExpanded true if session storage key "tapps/viewport" not presented', () => {
      const spy = mockSessionStorageGetItem(() => null);
      mount()
        .then((state) => {
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith('tapps/viewport');
          expect(state.isExpanded).toBe(true);
        })
        .catch((err) => expect(err).toBe(""))
        .finally(() => expect(isExpanded()).toBe(true));
    });
  });

  describe('first launch', () => {
    it('should set isFullScreen false', () => {
      mount()
        .then((s) => expect(s.isFullscreen).toBe(false))
        .catch((err) => expect(err).toBe(""))
        .finally(() => expect(isFullscreen()).toBe(false));
    });

    it('should set isExpanded true', () => {
      mount()
        .then((s) => expect(s.isExpanded).toBe(true))
        .catch((err) => expect(err).toBe(""))
        .finally(() => expect(isExpanded()).toBe(true));
    });
  });
});