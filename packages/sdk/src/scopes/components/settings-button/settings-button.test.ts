import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockSessionStorageGetItem,
  mockPageReload,
  mockSessionStorageSetItem,
} from 'test-utils';
import { emitMiniAppsEvent, TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setInitialized } from '@test-utils/setInitialized.js';
import { $version } from '@/scopes/globals.js';

import {
  show,
  hide,
  mount,
  onClick,
  unmount,
  offClick,
  isSupported,
  isVisible,
  isMounted,
} from './settings-button.js';

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
    { name: 'hide', fn: hide },
    { name: 'show', fn: show },
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
          'settingsButton component is not mounted. Consider using the mount() method',
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
    { name: 'onClick', fn: onClick },
    { name: 'offClick', fn: offClick },
  ])('$name', ({ fn, name }) => {
    it('should throw ERR_NOT_SUPPORTED if not supported', () => {
      const error = new TypedError(
        'ERR_NOT_SUPPORTED',
        `settingsButton.${name}() method is not supported in Mini Apps version 6.0`,
      );
      $version.set('6.0');
      expect(fn).toThrow(error);
      $version.set('6.1');
      expect(fn).not.toThrow(error);
    });

    describe('isSupported', () => {
      it('should return false if version is less than 6.10', () => {
        $version.set('6.9');
        expect(fn.isSupported()).toBe(false);

        $version.set('6.10');
        expect(fn.isSupported()).toBe(true);
      });
    });
  });
});

describe('isSupported', () => {
  it('should return false if version is less than 6.10', () => {
    $version.set('6.9');
    expect(isSupported()).toBe(false);

    $version.set('6.10');
    expect(isSupported()).toBe(true);
  });
});

describe.each([
  { name: 'hide', fn: hide, value: false },
  { name: 'show', fn: show, value: true },
])('$name', ({ fn, value }) => {
  beforeEach(setReady);

  it(`should set isVisible = ${value}`, () => {
    isVisible.set(!value);
    expect(isVisible()).toBe(!value);
    fn();
    expect(isVisible()).toBe(value);
  });

  it(`should call postEvent with "web_app_setup_settings_button" and { is_visible: ${value} }`, () => {
    isVisible.set(!value);
    const spy = mockPostEvent();
    fn();
    fn();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_settings_button', { is_visible: value });
  });

  it(`should call sessionStorage.setItem with "tapps/settingsButton" and "${value}" if value changed`, () => {
    isVisible.set(value);
    const spy = mockSessionStorageSetItem();
    fn();
    expect(spy).not.toHaveBeenCalled();

    isVisible.set(!value);
    fn();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('tapps/settingsButton', String(value));
  });
});

describe('mount', () => {
  beforeEach(setInitialized);

  it('should call postEvent with "web_app_setup_settings_button"', () => {
    const spy = mockPostEvent();
    mount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_setup_settings_button', { is_visible: false });
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

    it('should use value from session storage key "tapps/settingsButton"', () => {
      const spy = mockSessionStorageGetItem(() => 'true');
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/settingsButton');
      expect(isVisible()).toBe(true);
    });

    it('should set isVisible false if session storage key "tapps/settingsButton" not presented', () => {
      const spy = mockSessionStorageGetItem(() => null);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/settingsButton');
      expect(isVisible()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isVisible false', () => {
      mount();
      expect(isVisible()).toBe(false);
    });
  });
});

describe('onClick', () => {
  beforeEach(setReady);

  it('should add click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    emitMiniAppsEvent('settings_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should remove added listener if returned function was called', () => {
    const fn = vi.fn();
    const off = onClick(fn);
    off();
    emitMiniAppsEvent('settings_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('offClick', () => {
  beforeEach(setReady);

  it('should remove click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    offClick(fn);
    emitMiniAppsEvent('settings_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
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
