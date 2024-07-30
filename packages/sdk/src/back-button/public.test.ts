import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockPageReload, mockSessionStorageSetItem } from 'test-utils';

import { resetGlobals } from '@test-utils/resetGlobals.js';

import { emitMiniAppsEvent } from '@/bridge/events/event-handlers/emitMiniAppsEvent.js';
import { postEvent, version } from '@/globals/globals.js';

import { isVisible as _isVisible, isMounted as _isMounted } from './private.js';
import {
  show,
  isVisible,
  hide,
  mount,
  isMounted,
  onClick,
  unmount,
  offClick,
} from './public.js';

beforeEach(() => {
  resetGlobals();
  _isVisible.reset();
  _isMounted.reset();
  _isVisible.unsubAll();
  _isMounted.unsubAll();
  vi.restoreAllMocks();
  postEvent.set(() => null);
});

describe('mounted', () => {
  beforeEach(mount);
  afterEach(unmount);

  describe('hide', () => {
    it('should call postEvent with "web_app_setup_back_button" and { is_visible: false }', () => {
      _isVisible.set(true);
      const spy = vi.fn();
      postEvent.set(spy);
      hide();
      hide();
      hide();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_back_button', { is_visible: false });
    });
  });

  describe('show', () => {
    it('should call postEvent with "web_app_setup_back_button" and { is_visible: true }', () => {
      _isVisible.set(false);
      const spy = vi.fn();
      postEvent.set(spy);
      show();
      show();
      show();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_back_button', { is_visible: true });
    });
  });
});

describe('not mounted', () => {
  describe('hide', () => {
    it('should not call postEvent', () => {
      _isVisible.set(true);
      const spy = vi.fn();
      postEvent.set(spy);
      hide();
      hide();
      hide();
      expect(spy).toBeCalledTimes(0);
    });
  });

  describe('show', () => {
    it('should not call postEvent', () => {
      _isVisible.set(false);
      const spy = vi.fn();
      postEvent.set(spy);
      show();
      show();
      show();
      expect(spy).toBeCalledTimes(0);
    });
  });
});

describe('hide', () => {
  it('should set isVisible = false', () => {
    _isVisible.set(true);
    expect(isVisible()).toBe(true);
    hide();
    expect(isVisible()).toBe(false);
  });

  describe('isSupported', () => {
    it('should return false if version is less than 6.1. True otherwise', () => {
      version.set('6.0');
      expect(hide.isSupported()).toBe(false);

      version.set('6.1');
      expect(hide.isSupported()).toBe(true);

      version.set('6.2');
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

    it('should use isVisible prop from session storage key "telegram-apps/back-button"', () => {
      const spy = vi.fn(() => '{"isVisible":true}');
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/back-button');
      expect(isVisible()).toBe(true);
    });

    it('should set isVisible false if session storage key "telegram-apps/back-button" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/back-button');
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
    postEvent.set(postEventSpy);
    _isVisible.set(true);
    expect(postEventSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledTimes(1);

    postEventSpy.mockClear();
    storageSpy.mockClear();

    unmount();
    _isVisible.set(false);

    expect(postEventSpy).toHaveBeenCalledTimes(0);
    expect(storageSpy).toHaveBeenCalledTimes(0);
  });
});

describe('onClick', () => {
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
  it('should remove click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    offClick(fn);
    emitMiniAppsEvent('back_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('show', () => {
  it('should set isVisible = true', () => {
    _isVisible.set(false);
    expect(isVisible()).toBe(false);
    show();
    expect(isVisible()).toBe(true);
  });

  describe('isSupported', () => {
    it('should return false if version is less than 6.1. True otherwise', () => {
      version.set('6.0');
      expect(show.isSupported()).toBe(false);

      version.set('6.1');
      expect(show.isSupported()).toBe(true);

      version.set('6.2');
      expect(show.isSupported()).toBe(true);
    });
  });
});
