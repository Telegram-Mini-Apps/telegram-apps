import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockPageReload, mockSessionStorageSetItem } from 'test-utils';

import { resetGlobals } from '@test-utils/resetGlobals.js';

import { $postEvent } from '@/scopes/globals/globals.js';

import * as _ from './private.js';
import {
  isConfirmationNeeded,
  disableConfirmation,
  enableConfirmation,
  isMounted,
  mount,
  unmount,
} from './index.js';

beforeEach(() => {
  resetGlobals();
  _.isConfirmationNeeded.reset();
  _.isMounted.reset();
  _.isConfirmationNeeded.unsubAll();
  _.isMounted.unsubAll();
  vi.restoreAllMocks();
  $postEvent.set(() => null);
});

describe('mounted', () => {
  beforeEach(mount);
  afterEach(unmount);

  describe('disableConfirmation', () => {
    it('should call postEvent with "web_app_setup_closing_behavior" and { need_confirmation: false }', () => {
      _.isConfirmationNeeded.set(true);
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
      _.isConfirmationNeeded.set(false);
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
      _.isConfirmationNeeded.set(true);
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
      _.isConfirmationNeeded.set(false);
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
    _.isConfirmationNeeded.set(true);
    expect(isConfirmationNeeded()).toBe(true);
    disableConfirmation();
    expect(isConfirmationNeeded()).toBe(false);
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

    it('should use value from session storage key "telegram-apps/closing-behavior"', () => {
      const spy = vi.fn(() => 'true');
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/closing-behavior');
      expect(isConfirmationNeeded()).toBe(true);
    });

    it('should set isConfirmationNeeded false if session storage key "telegram-apps/closing-behavior" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/closing-behavior');
      expect(isConfirmationNeeded()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isConfirmationNeeded false', () => {
      mount();
      expect(isConfirmationNeeded()).toBe(false);
    });
  });
});

describe('unmount', () => {
  beforeEach(mount);

  it('should stop calling postEvent function and session storage updates when isConfirmationNeeded changes', () => {
    const postEventSpy = vi.fn();
    const storageSpy = mockSessionStorageSetItem();
    $postEvent.set(postEventSpy);
    _.isConfirmationNeeded.set(true);
    expect(postEventSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledTimes(1);

    postEventSpy.mockClear();
    storageSpy.mockClear();

    unmount();
    _.isConfirmationNeeded.set(false);

    expect(postEventSpy).toHaveBeenCalledTimes(0);
    expect(storageSpy).toHaveBeenCalledTimes(0);
  });
});

describe('enableConfirmation', () => {
  it('should set isConfirmationNeeded = true', () => {
    _.isConfirmationNeeded.set(false);
    expect(isConfirmationNeeded()).toBe(false);
    enableConfirmation();
    expect(isConfirmationNeeded()).toBe(true);
  });
});
