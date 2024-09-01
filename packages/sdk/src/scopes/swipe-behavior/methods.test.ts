import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockPageReload, mockSessionStorageSetItem } from 'test-utils';

import { resetPackageState } from '@test-utils/resetPackageState.js';

import { $postEvent } from '@/scopes/globals/globals.js';

import { isVerticalSwipesEnabled, isMounted } from './signals.js';
import {
  disableVerticalSwipes,
  enableVerticalSwipes,
  mount,
  unmount,
} from './methods.js';

beforeEach(() => {
  resetPackageState();
  isVerticalSwipesEnabled.reset();
  isMounted.reset();
  vi.restoreAllMocks();
  $postEvent.set(() => null);
});

describe('mounted', () => {
  beforeEach(mount);
  afterEach(unmount);

  describe('disableVerticalSwipes', () => {
    it('should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: false }', () => {
      isVerticalSwipesEnabled.set(true);
      const spy = vi.fn();
      $postEvent.set(spy);
      disableVerticalSwipes();
      disableVerticalSwipes();
      disableVerticalSwipes();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
    });
  });

  describe('enableVerticalSwipes', () => {
    it('should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: true }', () => {
      isVerticalSwipesEnabled.set(false);
      const spy = vi.fn();
      $postEvent.set(spy);
      enableVerticalSwipes();
      enableVerticalSwipes();
      enableVerticalSwipes();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: true });
    });
  });
});


describe('not mounted', () => {
  describe('disableVerticalSwipes', () => {
    it('should not call postEvent', () => {
      isVerticalSwipesEnabled.set(true);
      const spy = vi.fn();
      $postEvent.set(spy);
      disableVerticalSwipes();
      disableVerticalSwipes();
      disableVerticalSwipes();
      expect(spy).toBeCalledTimes(0);
    });
  });

  describe('enableVerticalSwipes', () => {
    it('should not call postEvent', () => {
      isVerticalSwipesEnabled.set(false);
      const spy = vi.fn();
      $postEvent.set(spy);
      enableVerticalSwipes();
      enableVerticalSwipes();
      enableVerticalSwipes();
      expect(spy).toBeCalledTimes(0);
    });
  });
});

describe('disableVerticalSwipes', () => {
  it('should set isVerticalSwipesEnabled = false', () => {
    isVerticalSwipesEnabled.set(true);
    expect(isVerticalSwipesEnabled()).toBe(true);
    disableVerticalSwipes();
    expect(isVerticalSwipesEnabled()).toBe(false);
  });
});

describe('mount', () => {
  afterEach(unmount);

  it('should set isMounted = true', () => {
    expect(isMounted()).toBe(false);
    mount();
    expect(isMounted()).toBe(true);
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
      expect(isVerticalSwipesEnabled()).toBe(true);
    });

    it('should set isVerticalSwipesEnabled false if session storage key "tapps/swipeBehavior" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/swipeBehavior');
      expect(isVerticalSwipesEnabled()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isVerticalSwipesEnabled false', () => {
      mount();
      expect(isVerticalSwipesEnabled()).toBe(false);
    });
  });
});

describe('unmount', () => {
  beforeEach(mount);

  it('should stop calling postEvent function and session storage updates when isVerticalSwipesEnabled changes', () => {
    const postEventSpy = vi.fn();
    const storageSpy = mockSessionStorageSetItem();
    $postEvent.set(postEventSpy);
    isVerticalSwipesEnabled.set(true);
    expect(postEventSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledTimes(1);

    postEventSpy.mockClear();
    storageSpy.mockClear();

    unmount();
    isVerticalSwipesEnabled.set(false);

    expect(postEventSpy).toHaveBeenCalledTimes(0);
    expect(storageSpy).toHaveBeenCalledTimes(0);
  });
});

describe('enableVerticalSwipes', () => {
  it('should set isVerticalSwipesEnabled = true', () => {
    isVerticalSwipesEnabled.set(false);
    expect(isVerticalSwipesEnabled()).toBe(false);
    enableVerticalSwipes();
    expect(isVerticalSwipesEnabled()).toBe(true);
  });
});
