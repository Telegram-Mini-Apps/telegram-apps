import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockPageReload, mockSessionStorageSetItem } from 'test-utils';
import { emitMiniAppsEvent } from '@telegram-apps/bridge';

import { resetPackageState, resetSignal } from '@test-utils/reset.js';

import { $postEvent, $version } from '@/scopes/globals/globals.js';

import { isVisible, isMounted } from './signals.js';
import {
  show,
  hide,
  mount,
  onClick,
  unmount,
  offClick,
} from './methods.js';

beforeEach(() => {
  resetPackageState();
  [isVisible, isMounted].forEach(resetSignal);
  vi.restoreAllMocks();
  $postEvent.set(() => null);
});

describe('mounted', () => {
  beforeEach(mount);
  afterEach(unmount);

  describe('hide', () => {
    it('should call postEvent with "web_app_setup_settings_button" and { is_visible: false }', () => {
      isVisible.set(true);
      const spy = vi.fn();
      $postEvent.set(spy);
      hide();
      hide();
      hide();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_settings_button', { is_visible: false });
    });
  });

  describe('show', () => {
    it('should call postEvent with "web_app_setup_settings_button" and { is_visible: true }', () => {
      isVisible.set(false);
      const spy = vi.fn();
      $postEvent.set(spy);
      show();
      show();
      show();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_settings_button', { is_visible: true });
    });
  });
});

describe('not mounted', () => {
  describe('hide', () => {
    it('should not call postEvent', () => {
      isVisible.set(true);
      const spy = vi.fn();
      $postEvent.set(spy);
      hide();
      expect(spy).toBeCalledTimes(0);
    });

    it('should not save state in storage', () => {
      isVisible.set(true);
      const spy = mockSessionStorageSetItem();
      hide();
      expect(spy).toBeCalledTimes(0);
    });
  });

  describe('show', () => {
    it('should not call postEvent', () => {
      isVisible.set(false);
      const spy = vi.fn();
      $postEvent.set(spy);
      show();
      show();
      show();
      expect(spy).toBeCalledTimes(0);
    });

    it('should not save state in storage', () => {
      isVisible.set(false);
      const spy = mockSessionStorageSetItem();
      show();
      show();
      show();
      expect(spy).toBeCalledTimes(0);
    });
  });
});

describe('hide', () => {
  it('should set isVisible = false', () => {
    isVisible.set(true);
    expect(isVisible()).toBe(true);
    hide();
    expect(isVisible()).toBe(false);
  });

  describe('isSupported', () => {
    it('should return false if version is less than 6.10. True otherwise', () => {
      $version.set('6.9');
      expect(hide.isSupported()).toBe(false);

      $version.set('6.10');
      expect(hide.isSupported()).toBe(true);

      $version.set('6.11');
      expect(hide.isSupported()).toBe(true);
    });
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

    it('should use value from session storage key "tapps/settingsButton"', () => {
      const spy = vi.fn(() => 'true');
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/settingsButton');
      expect(isVisible()).toBe(true);
    });

    it('should set isVisible false if session storage key "tapps/settingsButton" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
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

describe('unmount', () => {
  beforeEach(mount);

  it('should stop calling postEvent function and session storage updates when isVisible changes', () => {
    const postEventSpy = vi.fn();
    const storageSpy = mockSessionStorageSetItem();
    $postEvent.set(postEventSpy);
    isVisible.set(true);
    expect(postEventSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledTimes(1);

    postEventSpy.mockClear();
    storageSpy.mockClear();

    unmount();
    isVisible.set(false);

    expect(postEventSpy).toHaveBeenCalledTimes(0);
    expect(storageSpy).toHaveBeenCalledTimes(0);
  });
});

describe('onClick', () => {
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
  it('should remove click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    offClick(fn);
    emitMiniAppsEvent('settings_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('show', () => {
  it('should set isVisible = true', () => {
    isVisible.set(false);
    expect(isVisible()).toBe(false);
    show();
    expect(isVisible()).toBe(true);
  });

  describe('isSupported', () => {
    it('should return false if version is less than 6.10. True otherwise', () => {
      $version.set('6.9');
      expect(show.isSupported()).toBe(false);

      $version.set('6.10');
      expect(show.isSupported()).toBe(true);

      $version.set('6.11');
      expect(show.isSupported()).toBe(true);
    });
  });
});
