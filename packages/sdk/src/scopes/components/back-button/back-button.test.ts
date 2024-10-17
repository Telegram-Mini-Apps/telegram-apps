import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockPageReload, mockSessionStorageSetItem } from 'test-utils';
import { emitMiniAppsEvent, TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
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
} from './back-button.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe('hide', () => {
  beforeEach(() => {
    $version.set('10');
    isMounted.set(true);
  });

  it('should set isVisible = false', () => {
    isVisible.set(true);
    expect(isVisible()).toBe(true);
    hide();
    expect(isVisible()).toBe(false);
  });
});

describe('isSupported', () => {
  it('should return false if version is less than 6.1. True otherwise', () => {
    $version.set('6.0');
    expect(isSupported()).toBe(false);

    $version.set('6.1');
    expect(isSupported()).toBe(true);

    $version.set('6.2');
    expect(isSupported()).toBe(true);
  });
});

describe('mount', () => {
  beforeEach(() => {
    $version.set('10');
  });

  it('should call postEvent with "web_app_setup_back_button"', () => {
    const spy = mockPostEvent();
    mount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_setup_back_button', { is_visible: false });
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

    it('should use value from session storage key "tapps/backButton"', () => {
      const spy = vi.fn(() => 'true');
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/backButton');
      expect(isVisible()).toBe(true);
    });

    it('should set isVisible false if session storage key "tapps/backButton" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/backButton');
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
  beforeEach(() => {
    $version.set('10');
    isMounted.set(true);
  });

  it('should add click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    emitMiniAppsEvent('back_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should remove added listener if returned function was called', () => {
    const fn = vi.fn();
    const off = onClick(fn);
    off();
    emitMiniAppsEvent('back_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('offClick', () => {
  beforeEach(() => {
    $version.set('10');
    isMounted.set(true);
  });

  it('should remove click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    offClick(fn);
    emitMiniAppsEvent('back_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('unmount', () => {
  beforeEach(() => {
    $version.set('10');
    mount();
  });

  it('should stop calling postEvent function and session storage updates when isVisible changes', () => {
    const postEventSpy = mockPostEvent();
    const storageSpy = mockSessionStorageSetItem();
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

describe('show', () => {
  beforeEach(() => {
    $version.set('10');
    isMounted.set(true);
  });

  it('should set isVisible = true', () => {
    isVisible.set(false);
    expect(isVisible()).toBe(false);
    show();
    expect(isVisible()).toBe(true);
  });
});

describe('mounted', () => {
  beforeEach(() => {
    $version.set('10');
    mount();
  });

  describe('hide', () => {
    it('should call postEvent with "web_app_setup_back_button" and { is_visible: false }', () => {
      isVisible.set(true);
      const spy = mockPostEvent();
      hide();
      hide();
      hide();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_back_button', { is_visible: false });
    });
  });

  describe('show', () => {
    it('should call postEvent with "web_app_setup_back_button" and { is_visible: true }', () => {
      isVisible.set(false);
      const spy = mockPostEvent();
      show();
      show();
      show();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_back_button', { is_visible: true });
    });
  });
});

describe('support check', () => {
  beforeEach(() => {
    isMounted.set(true);
  });

  it.each([
    { fn: mount, name: 'mount' },
    { fn: () => onClick(console.log), name: 'onClick' },
    { fn: () => offClick(console.log), name: 'offClick' },
  ])('$name function should throw ERR_NOT_SUPPORTED if version is less than 6.1', ({ fn }) => {
    $version.set('6.0');
    expect(fn).toThrow(new TypedError('ERR_NOT_SUPPORTED'));

    $version.set('6.1');
    expect(fn).not.toThrow();
  });
});

describe('mount check', () => {
  beforeEach(() => {
    $version.set('10');
  });

  it.each([
    { fn: hide, name: 'hide' },
    { fn: show, name: 'show' },
  ])('$name function should throw ERR_NOT_MOUNTED if component was not mounted', ({ fn }) => {
    expect(fn).toThrow(new TypedError('ERR_NOT_MOUNTED'));
    isMounted.set(true);
    expect(fn).not.toThrow();
  });
});
