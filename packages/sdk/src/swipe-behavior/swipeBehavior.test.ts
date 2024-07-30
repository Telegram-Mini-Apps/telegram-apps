import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockPageReload, mockSessionStorageSetItem } from 'test-utils';

import { resetGlobals } from '@test-utils/resetGlobals.js';

import { postEvent } from '@/globals/globals.js';

import * as _ from './swipeBehavior.private.js';
import {
  isVerticalSwipesEnabled,
  disableVerticalSwipes,
  enableVerticalSwipes,
  isMounted,
  mount,
  unmount,
} from './swipeBehavior.js';

beforeEach(() => {
  resetGlobals();
  _.isVerticalSwipesEnabled.reset();
  _.isMounted.reset();
  _.isVerticalSwipesEnabled.unsubAll();
  _.isMounted.unsubAll();
  vi.restoreAllMocks();
  postEvent.set(() => null);
});

describe('mounted', () => {
  beforeEach(mount);
  afterEach(unmount);

  describe('disableVerticalSwipes', () => {
    it('should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: false }', () => {
      _.isVerticalSwipesEnabled.set(true);
      const spy = vi.fn();
      postEvent.set(spy);
      disableVerticalSwipes();
      disableVerticalSwipes();
      disableVerticalSwipes();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
    });
  });

  describe('enableVerticalSwipes', () => {
    it('should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: true }', () => {
      _.isVerticalSwipesEnabled.set(false);
      const spy = vi.fn();
      postEvent.set(spy);
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
      _.isVerticalSwipesEnabled.set(true);
      const spy = vi.fn();
      postEvent.set(spy);
      disableVerticalSwipes();
      disableVerticalSwipes();
      disableVerticalSwipes();
      expect(spy).toBeCalledTimes(0);
    });
  });

  describe('enableVerticalSwipes', () => {
    it('should not call postEvent', () => {
      _.isVerticalSwipesEnabled.set(false);
      const spy = vi.fn();
      postEvent.set(spy);
      enableVerticalSwipes();
      enableVerticalSwipes();
      enableVerticalSwipes();
      expect(spy).toBeCalledTimes(0);
    });
  });
});

describe('disableVerticalSwipes', () => {
  it('should set isVerticalSwipesEnabled = false', () => {
    _.isVerticalSwipesEnabled.set(true);
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

    it('should use value from session storage key "telegram-apps/swipe-behavior"', () => {
      const spy = vi.fn(() => 'true');
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/swipe-behavior');
      expect(isVerticalSwipesEnabled()).toBe(true);
    });

    it('should set isVerticalSwipesEnabled false if session storage key "telegram-apps/swipe-behavior" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/swipe-behavior');
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
    postEvent.set(postEventSpy);
    _.isVerticalSwipesEnabled.set(true);
    expect(postEventSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledTimes(1);

    postEventSpy.mockClear();
    storageSpy.mockClear();

    unmount();
    _.isVerticalSwipesEnabled.set(false);

    expect(postEventSpy).toHaveBeenCalledTimes(0);
    expect(storageSpy).toHaveBeenCalledTimes(0);
  });
});

describe('enableVerticalSwipes', () => {
  it('should set isVerticalSwipesEnabled = true', () => {
    _.isVerticalSwipesEnabled.set(false);
    expect(isVerticalSwipesEnabled()).toBe(false);
    enableVerticalSwipes();
    expect(isVerticalSwipesEnabled()).toBe(true);
  });
});
