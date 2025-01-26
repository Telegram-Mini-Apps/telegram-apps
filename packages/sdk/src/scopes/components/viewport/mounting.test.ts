import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockPageReload, mockSessionStorageGetItem } from 'test-utils';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import {
  resetPackageState,
  mockPostEvent,
  mockMiniAppsEnv,
  setLaunchParams,
} from '@test-utils/utils.js';

import { mount, isMounted } from './mounting.js';
import { state, isExpanded } from './signals.js';
import { isFullscreen } from './fullscreen.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe('safety', () => {
  testSafety(mount, 'mount', {
    component: 'viewport',
  });
});

describe('is safe', () => {
  beforeEach(() => {
    mockMiniAppsEnv();
    setLaunchParams({
      tgWebAppVersion: '7.9',
      tgWebAppPlatform: 'tdesktop',
    });
  });

  it('should set isMounted = true', async () => {
    expect(isMounted()).toBe(false);
    await mount();
    expect(isMounted()).toBe(true);
  });

  describe('page reload', () => {
    beforeEach(() => {
      mockPageReload();
    });

    it('should use values from session storage key "tapps/viewport"', async () => {
      const storageState = {
        contentSafeAreaInsets: {
          bottom: 331,
          left: 2,
          right: 5,
          top: 1,
        },
        height: 333,
        isExpanded: true,
        isFullscreen: true,
        safeAreaInsets: {
          bottom: 55,
          left: 12,
          right: 31,
          top: 5,
        },
        stableHeight: 12,
        width: 444,
      };
      const spy = mockSessionStorageGetItem(() => {
        return JSON.stringify(storageState);
      });

      await mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/viewport');
      expect(state()).toEqual(storageState);
    });

    it('should set isFullscreen false if session storage key "tapps/viewport" is not present', async () => {
      const spy = mockSessionStorageGetItem(() => null);

      await mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/viewport');
      expect(isFullscreen()).toBe(false);
    });

    it('should set isExpanded true if session storage key "tapps/viewport" is not present', async () => {
      const spy = mockSessionStorageGetItem(() => null);
      await mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/viewport');
      expect(isExpanded()).toBe(true);
    });
  });

  describe('first launch', () => {
    it('should set isFullscreen false', async () => {
      await mount();
      expect(isFullscreen()).toBe(false);
    });

    // TODO: Incorrect test. This value depends on the platform also.
    // it('should set isExpanded true', async () => {
    //   expect((await mount()).isExpanded).toBe(false);
    // });
  });
});