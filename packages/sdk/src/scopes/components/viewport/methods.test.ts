import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockPageReload, mockSessionStorageGetItem } from 'test-utils';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';

import { mount, expand, bindCssVars, exitFullscreen, requestFullscreen } from './methods.js';
import { isMounted } from './signals.js';

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
        isExpanded: true,
        isFullscreen: true,
        height: 1000,
        width: 2000,
        stableHeight: 1000,
      };
      const spy = mockSessionStorageGetItem(() => {
        return JSON.stringify(storageState);
      });

      const state = await mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/viewport');
      expect(state).toEqual(storageState);
    });

    it('should set isFullscreen false if session storage key "tapps/viewport" is not present', async () => {
      const spy = mockSessionStorageGetItem(() => null);

      const state = await mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/viewport');
      expect(state.isFullscreen).toBe(false);
    });

    it('should set isExpanded true if session storage key "tapps/viewport" is not present', async () => {
      const spy = mockSessionStorageGetItem(() => null);
      const state = await mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/viewport');
      expect(state.isExpanded).toBe(true);
    });
  });

  describe('first launch', () => {
    it('should set isFullscreen false', async () => {
      expect((await mount()).isFullscreen).toBe(false)
    });

    // TODO: Incorrect test. This value depends on the platform also.
    // it('should set isExpanded true', async () => {
    //   expect((await mount()).isExpanded).toBe(false);
    // });
  });
});