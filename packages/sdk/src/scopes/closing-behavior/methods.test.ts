import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockPageReload, mockSessionStorageSetItem } from 'test-utils';

import { resetPackageState, resetSignal } from '@test-utils/reset.js';

import { $postEvent } from '@/scopes/globals/globals.js';

import { isConfirmationEnabled, isMounted } from './signals.js';
import {
  disableConfirmation,
  enableConfirmation,
  mount,
  unmount,
} from './methods.js';

beforeEach(() => {
  resetPackageState();
  [isConfirmationEnabled, isMounted].forEach(resetSignal);
  vi.restoreAllMocks();
  $postEvent.set(() => null);
});

describe('mounted', () => {
  beforeEach(mount);
  afterEach(unmount);

  describe('disableConfirmation', () => {
    it('should call postEvent with "web_app_setup_closing_behavior" and { need_confirmation: false }', () => {
      isConfirmationEnabled.set(true);
      const spy = vi.fn();
      $postEvent.set(spy);
      disableConfirmation();
      disableConfirmation();
      disableConfirmation();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_closing_behavior', { need_confirmation: false });
    });
  });

  describe('enableConfirmation', () => {
    it('should call postEvent with "web_app_setup_closing_behavior" and { need_confirmation: true }', () => {
      isConfirmationEnabled.set(false);
      const spy = vi.fn();
      $postEvent.set(spy);
      enableConfirmation();
      enableConfirmation();
      enableConfirmation();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_closing_behavior', { need_confirmation: true });
    });
  });
});


describe('not mounted', () => {
  describe('disableConfirmation', () => {
    it('should not call postEvent', () => {
      isConfirmationEnabled.set(true);
      const spy = vi.fn();
      $postEvent.set(spy);
      disableConfirmation();
      disableConfirmation();
      disableConfirmation();
      expect(spy).toBeCalledTimes(0);
    });
  });

  describe('enableConfirmation', () => {
    it('should not call postEvent', () => {
      isConfirmationEnabled.set(false);
      const spy = vi.fn();
      $postEvent.set(spy);
      enableConfirmation();
      enableConfirmation();
      enableConfirmation();
      expect(spy).toBeCalledTimes(0);
    });
  });
});

describe('disableConfirmation', () => {
  it('should set isConfirmationNeeded = false', () => {
    isConfirmationEnabled.set(true);
    expect(isConfirmationEnabled()).toBe(true);
    disableConfirmation();
    expect(isConfirmationEnabled()).toBe(false);
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

    it('should use value from session storage key "tapps/closingConfirmation"', () => {
      const spy = vi.fn(() => 'true');
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/closingConfirmation');
      expect(isConfirmationEnabled()).toBe(true);
    });

    it('should set isConfirmationNeeded false if session storage key "tapps/closingConfirmation" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/closingConfirmation');
      expect(isConfirmationEnabled()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isConfirmationNeeded false', () => {
      mount();
      expect(isConfirmationEnabled()).toBe(false);
    });
  });
});

describe('unmount', () => {
  beforeEach(mount);

  it('should stop calling postEvent function and session storage updates when isConfirmationNeeded changes', () => {
    const postEventSpy = vi.fn();
    const storageSpy = mockSessionStorageSetItem();
    $postEvent.set(postEventSpy);
    isConfirmationEnabled.set(true);
    expect(postEventSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledTimes(1);

    postEventSpy.mockClear();
    storageSpy.mockClear();

    unmount();
    isConfirmationEnabled.set(false);

    expect(postEventSpy).toHaveBeenCalledTimes(0);
    expect(storageSpy).toHaveBeenCalledTimes(0);
  });
});

describe('enableConfirmation', () => {
  it('should set isConfirmationNeeded = true', () => {
    isConfirmationEnabled.set(false);
    expect(isConfirmationEnabled()).toBe(false);
    enableConfirmation();
    expect(isConfirmationEnabled()).toBe(true);
  });
});
