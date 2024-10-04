import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockPageReload, mockSessionStorageSetItem } from 'test-utils';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { $version } from '@/scopes/globals.js';

import {
  disableVertical,
  enableVertical,
  mount,
  unmount,
  isSupported,
  isMounted,
  isVerticalEnabled,
} from './swipe-behavior.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe('mounted', () => {
  beforeEach(mount);
  afterEach(unmount);

  describe('disableVerticalSwipes', () => {
    it('should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: false }', () => {
      isVerticalEnabled.set(true);
      const spy = mockPostEvent();
      disableVertical();
      disableVertical();
      disableVertical();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
    });
  });

  describe('enableVerticalSwipes', () => {
    it('should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: true }', () => {
      isVerticalEnabled.set(false);
      const spy = mockPostEvent();
      enableVertical();
      enableVertical();
      enableVertical();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: true });
    });
  });
});

describe('not mounted', () => {
  describe('disableVerticalSwipes', () => {
    it('should not call postEvent', () => {
      isVerticalEnabled.set(true);
      const spy = mockPostEvent();
      disableVertical();
      disableVertical();
      disableVertical();
      expect(spy).toBeCalledTimes(0);
    });
  });

  describe('enableVerticalSwipes', () => {
    it('should not call postEvent', () => {
      isVerticalEnabled.set(false);
      const spy = mockPostEvent();
      enableVertical();
      enableVertical();
      enableVertical();
      expect(spy).toBeCalledTimes(0);
    });
  });
});

describe('disableVerticalSwipes', () => {
  it('should set isVerticalSwipesEnabled = false', () => {
    isVerticalEnabled.set(true);
    expect(isVerticalEnabled()).toBe(true);
    disableVertical();
    expect(isVerticalEnabled()).toBe(false);
  });
});

describe('isSupported', () => {
  it('should return false if version is less than 7.7. True otherwise', () => {
    $version.set('7.6');
    expect(isSupported()).toBe(false);

    $version.set('7.7');
    expect(isSupported()).toBe(true);

    $version.set('7.8');
    expect(isSupported()).toBe(true);
  });
});

describe('mount', () => {
  it('should set isMounted = true', () => {
    expect(isMounted()).toBe(false);
    mount();
    expect(isMounted()).toBe(true);
  });

  it('should call postEvent with "web_app_setup_swipe_behavior"', () => {
    const spy = mockPostEvent();
    mount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
  });

  describe('page reload', () => {
    beforeEach(() => {
      mockPageReload();
    });

    it('should use value from session storage key "tapps/swipeBehavior"', () => {
      const spy = vi.fn(() => 'true');
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/swipeBehavior');
      expect(isVerticalEnabled()).toBe(true);
    });

    it('should set isVerticalSwipesEnabled false if session storage key "tapps/swipeBehavior" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/swipeBehavior');
      expect(isVerticalEnabled()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isVerticalSwipesEnabled false', () => {
      mount();
      expect(isVerticalEnabled()).toBe(false);
    });
  });
});

describe('unmount', () => {
  beforeEach(mount);

  it('should stop calling postEvent function and session storage updates when isVerticalSwipesEnabled changes', () => {
    const postEventSpy = mockPostEvent();
    const storageSpy = mockSessionStorageSetItem();
    isVerticalEnabled.set(true);
    expect(postEventSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledTimes(1);

    postEventSpy.mockClear();
    storageSpy.mockClear();

    unmount();
    isVerticalEnabled.set(false);

    expect(postEventSpy).toHaveBeenCalledTimes(0);
    expect(storageSpy).toHaveBeenCalledTimes(0);
  });
});

describe('enableVerticalSwipes', () => {
  it('should set isVerticalSwipesEnabled = true', () => {
    isVerticalEnabled.set(false);
    expect(isVerticalEnabled()).toBe(false);
    enableVertical();
    expect(isVerticalEnabled()).toBe(true);
  });
});
