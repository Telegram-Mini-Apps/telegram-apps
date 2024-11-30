import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockSessionStorageGetItem,
  mockPageReload,
} from 'test-utils';

import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';

import {
  isMounted,
  mount,
  unmount,
  isSupported,
  requestFullScreen,
  exitFullScreen,
  isFullScreen,
} from './full-screen.js';
import {mockPostEvent} from "@test-utils/mockPostEvent.js";

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
  isMounted.set(true);
}

describe.each([
  ['requestFullScreen', requestFullScreen, isMounted],
  ['exitFullScreen', exitFullScreen, isMounted],
  ['mount', mount, undefined],
] as const)('%s', (name, fn, isMounted) => {
  testSafety(fn, name, {
    component: 'fullScreen',
    minVersion: '8.0',
    isMounted,
  });
});

describe('isSupported', () => {
  testIsSupported(isSupported, '8.0');
});

describe('mount', () => {
  beforeEach(() => {
    mockMiniAppsEnv();
    setMaxVersion();
  });

  it('should set isMounted = true', () => {
    expect(isMounted()).toBe(false);
    mount();
    expect(isMounted()).toBe(true);
  });

  describe('page reload', () => {
    beforeEach(() => {
      mockPageReload();
    });

    it('should use value from session storage key "tapps/fullScreen"', () => {
      const spy = mockSessionStorageGetItem(() => 'true');
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/fullScreen');
      expect(isFullScreen()).toBe(true);
    });

    it('should set isFullScreen false if session storage key "tapps/fullScreen" not presented', () => {
      const spy = mockSessionStorageGetItem(() => null);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/fullScreen');
      expect(isFullScreen()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isFullScreen false', () => {
      mount();
      expect(isFullScreen()).toBe(false);
    });
  });
});

describe('unmount', () => {
  beforeEach(setAvailable);

  it('should set isMounted = false', () => {
    expect(isMounted()).toBe(true);
    unmount();
    expect(isMounted()).toBe(false);
  });
});
