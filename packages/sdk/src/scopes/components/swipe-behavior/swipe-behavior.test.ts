import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';
import { mockSessionStorageGetItem, mockPageReload, mockSessionStorageSetItem } from 'test-utils';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setInitialized } from '@test-utils/setInitialized.js';
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

function setReady() {
  isMounted.set(true);
  setInitialized();
}

describe('check initialization and mount', () => {
  describe.each([
    { name: 'disableVertical', fn: disableVertical },
    { name: 'enableVertical', fn: enableVertical },
  ])('$name', ({ fn }) => {
    it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
      const error = new TypedError(
        'ERR_NOT_INITIALIZED',
        'The package was not initialized. Consider using the package init() function',
      );
      expect(fn).toThrow(error);
      setInitialized();
      expect(fn).not.toThrow(error);
    });

    describe('initialized', () => {
      beforeEach(setInitialized);

      it('should throw ERR_NOT_MOUNTED if component was not mounted', () => {
        const error = new TypedError(
          'ERR_NOT_MOUNTED',
          'swipeBehavior component is not mounted. Consider using the mount() method',
        );
        expect(fn).toThrow(error);
        isMounted.set(true);
        expect(fn).not.toThrow(error);
      });
    });
  });
});

describe('check support', () => {
  describe.each([
    { name: 'mount', fn: mount },
  ])('$name', ({ fn, name }) => {
    it('should throw ERR_NOT_SUPPORTED if package is not initialized', () => {
      const error = new TypedError(
        'ERR_NOT_SUPPORTED',
        `swipeBehavior.${name}() method is not supported in Mini Apps version 6.0`,
      );
      $version.set('6.0');
      expect(fn).toThrow(error);
      $version.set('6.1');
      expect(fn).not.toThrow(error);
    });

    describe('isSupported', () => {
      it('should return false if version is less than 7.7', () => {
        $version.set('7.6');
        expect(fn.isSupported()).toBe(false);

        $version.set('7.7');
        expect(fn.isSupported()).toBe(true);
      });
    });
  });
});

describe('isSupported', () => {
  it('should return false if version is less than 7.7', () => {
    $version.set('7.6');
    expect(isSupported()).toBe(false);

    $version.set('7.7');
    expect(isSupported()).toBe(true);
  });
});

describe.each([
  { name: 'disableVertical', fn: disableVertical, value: false },
  { name: 'enableVertical', fn: enableVertical, value: true },
])('$name', ({ fn, value }) => {
  beforeEach(setReady);

  it(`should set isVerticalEnabled = ${value}`, () => {
    isVerticalEnabled.set(!value);
    expect(isVerticalEnabled()).toBe(!value);
    fn();
    expect(isVerticalEnabled()).toBe(value);
  });

  it(`should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: ${value} }`, () => {
    isVerticalEnabled.set(!value);
    const spy = mockPostEvent();
    fn();
    fn();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: value });
  });

  it(`should call sessionStorage.setItem with "tapps/swipeBehavior" and "${value}" if value changed`, () => {
    isVerticalEnabled.set(value);
    const spy = mockSessionStorageSetItem();
    fn();
    expect(spy).not.toHaveBeenCalled();

    isVerticalEnabled.set(!value);
    fn();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('tapps/swipeBehavior', String(value));
  });
});

describe('mount', () => {
  beforeEach(setInitialized);

  it('should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: false }', () => {
    const spy = mockPostEvent();
    mount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
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

    it('should use value from session storage key "tapps/swipeBehavior"', () => {
      const spy = mockSessionStorageGetItem(() => 'true');
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/swipeBehavior');
      expect(isVerticalEnabled()).toBe(true);
    });

    it('should set isVerticalSwipesEnabled false if session storage key "tapps/swipeBehavior" not presented', () => {
      const spy = mockSessionStorageGetItem(() => null);
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
  beforeEach(setReady);

  it('should set isMounted = false', () => {
    expect(isMounted()).toBe(true);
    unmount();
    expect(isMounted()).toBe(false);
  });
});
