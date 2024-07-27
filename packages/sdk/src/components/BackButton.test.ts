import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  state,
  show,
  isVisible,
  hide,
  restore,
  onClick,
  offClick,
} from './BackButton.js';
import { emitMiniAppsEvent } from '@/bridge/events/event-handlers/emitMiniAppsEvent.js';
import { resetMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';
import { mockSessionStorageGetItem } from 'test-utils';
import { postEvent, version } from '@/components/globals.js';
import { postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';
import { mockPageReload } from '@test-utils/mockPageReload.js';

beforeEach(() => {
  // Mock postEvent.
  postEvent.set(() => null);

  // Reset all signals.
  isVisible.set(false);
  isVisible.unsubscribeAll();
  state.unsubscribeAll();

  // Reset mini apps event emitter and all mocks.
  resetMiniAppsEventEmitter();
  vi.restoreAllMocks();
});

afterEach(() => {
  // Reset postEvent.
  postEvent.set(defaultPostEvent);
});

describe('hide', () => {
  it('should set isVisible = false', () => {
    isVisible.set(true);
    expect(isVisible()).toBe(true);
    hide();
    expect(isVisible()).toBe(false);
  });

  it('should call postEvent with "web_app_setup_back_button" and { is_visible: false } if value changed', () => {
    isVisible.set(true);
    const spy = vi.fn();
    postEvent.set(spy);
    hide();
    hide();
    hide();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_back_button', { is_visible: false });
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

describe('restore', () => {
  describe('page reload', () => {
    beforeEach(() => {
      mockPageReload();
    });

    it('should use isVisible prop from session storage key "telegram-apps/bb"', () => {
      const spy = vi.fn(() => '{"isVisible":true}');
      mockSessionStorageGetItem(spy);
      restore();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/bb');
      expect(isVisible()).toBe(true);
    });

    it('should set isVisible false if session storage key "telegram-apps/bb" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      restore();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/bb');
      expect(isVisible()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isVisible false', () => {
      restore();
      expect(isVisible()).toBe(false);
    });
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
    expect(isVisible()).toBe(false);
    show();
    expect(isVisible()).toBe(true);
  });

  it('should call postEvent with "web_app_setup_back_button" and { is_visible: true } if value changed', () => {
    isVisible.set(false);
    const spy = vi.fn();
    postEvent.set(spy);
    show();
    show();
    show();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_back_button', { is_visible: true });
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

describe('state', () => {
  it('should return object with isVisible: boolean', () => {
    expect(state()).toStrictEqual({ isVisible: false });
    isVisible.set(true);
    expect(state()).toStrictEqual({ isVisible: true });
  });
});
