import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem } from 'test-utils';

import { postEvent, version } from '@/components/globals.js';
import { postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';
import { mockPageReload } from '@test-utils/mockPageReload.js';

import {
  enableVerticalSwipe,
  disableVerticalSwipe,
  isVerticalSwipeEnabled,
  restore,
} from './swipeBehavior.js';

beforeEach(() => {
  // Mock postEvent.
  postEvent.set(() => null);

  // Reset all signals.
  isVerticalSwipeEnabled.set(false);
  isVerticalSwipeEnabled.unsubAll();

  // Reset all mocks.
  vi.restoreAllMocks();
});

afterEach(() => {
  // Reset postEvent.
  postEvent.set(defaultPostEvent);
});

describe('disableVerticalSwipe', () => {
  it('should set isVerticalSwipeEnabled = false', () => {
    isVerticalSwipeEnabled.set(true);
    expect(isVerticalSwipeEnabled()).toBe(true);
    disableVerticalSwipe();
    expect(isVerticalSwipeEnabled()).toBe(false);
  });

  it('should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: false } if value changed', () => {
    isVerticalSwipeEnabled.set(true);
    const spy = vi.fn();
    postEvent.set(spy);
    disableVerticalSwipe();
    disableVerticalSwipe();
    disableVerticalSwipe();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
  });

  describe('isSupported', () => {
    it('should return false if version is less than 7.7. True otherwise', () => {
      version.set('7.6');
      expect(disableVerticalSwipe.isSupported()).toBe(false);

      version.set('7.7');
      expect(disableVerticalSwipe.isSupported()).toBe(true);

      version.set('7.8');
      expect(disableVerticalSwipe.isSupported()).toBe(true);
    });
  });
});

describe('enableVerticalSwipe', () => {
  it('should set isVerticalSwipeEnabled = true', () => {
    isVerticalSwipeEnabled.set(false);
    expect(isVerticalSwipeEnabled()).toBe(false);
    enableVerticalSwipe();
    expect(isVerticalSwipeEnabled()).toBe(true);
  });

  it('should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: true } if value changed', () => {
    isVerticalSwipeEnabled.set(false);
    const spy = vi.fn();
    postEvent.set(spy);
    enableVerticalSwipe();
    enableVerticalSwipe();
    enableVerticalSwipe();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: true });
  });

  describe('isSupported', () => {
    it('should return false if version is less than 7.7. True otherwise', () => {
      version.set('7.6');
      expect(enableVerticalSwipe.isSupported()).toBe(false);

      version.set('7.7');
      expect(enableVerticalSwipe.isSupported()).toBe(true);

      version.set('7.8');
      expect(enableVerticalSwipe.isSupported()).toBe(true);
    });
  });
});

describe('restore', () => {
  describe('page reload', () => {
    beforeEach(() => {
      mockPageReload();
    });

    it('should use isVerticalSwipeEnabled prop from session storage key "telegram-apps/swipe-behavior"', () => {
      const spy = vi.fn(() => '{"isVerticalSwipeEnabled":true}');
      mockSessionStorageGetItem(spy);
      restore();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/swipe-behavior');
      expect(isVerticalSwipeEnabled()).toBe(true);
    });

    it('should set isVerticalSwipeEnabled false if session storage key "telegram-apps/swipe-behavior" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      restore();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/swipe-behavior');
      expect(isVerticalSwipeEnabled()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isVerticalSwipeEnabled false', () => {
      restore();
      expect(isVerticalSwipeEnabled()).toBe(false);
    });
  });
});
