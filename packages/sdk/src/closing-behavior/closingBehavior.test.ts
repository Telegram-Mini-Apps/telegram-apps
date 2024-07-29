import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem } from 'test-utils';

import { postEvent } from '@/components/globals.js';
import { postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';
import { mockPageReload } from '@test-utils/mockPageReload.js';

import {
  isConfirmationNeeded,
  disableConfirmation,
  enableConfirmation,
  restore,
} from './closingBehavior.js';

beforeEach(() => {
  // Mock postEvent.
  postEvent.set(() => null);

  // Reset all signals.
  isConfirmationNeeded.set(false);
  isConfirmationNeeded.unsubAll();

  // Reset all mocks.
  vi.restoreAllMocks();
});

afterEach(() => {
  // Reset postEvent.
  postEvent.set(defaultPostEvent);
});

describe('disableConfirmation', () => {
  it('should set isConfirmationNeeded = false', () => {
    isConfirmationNeeded.set(true);
    expect(isConfirmationNeeded()).toBe(true);
    disableConfirmation();
    expect(isConfirmationNeeded()).toBe(false);
  });

  it('should call postEvent with "web_app_setup_closing_behavior" and { need_confirmation: false } if value changed', () => {
    isConfirmationNeeded.set(true);
    const spy = vi.fn();
    postEvent.set(spy);
    disableConfirmation();
    disableConfirmation();
    disableConfirmation();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_closing_behavior', { need_confirmation: false });
  });
});

describe('enableConfirmation', () => {
  it('should set isConfirmationNeeded = true', () => {
    isConfirmationNeeded.set(false);
    expect(isConfirmationNeeded()).toBe(false);
    enableConfirmation();
    expect(isConfirmationNeeded()).toBe(true);
  });

  it('should call postEvent with "web_app_setup_closing_behavior" and { need_confirmation: true } if value changed', () => {
    isConfirmationNeeded.set(false);
    const spy = vi.fn();
    postEvent.set(spy);
    enableConfirmation();
    enableConfirmation();
    enableConfirmation();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_closing_behavior', { need_confirmation: true });
  });
});

describe('restore', () => {
  describe('page reload', () => {
    beforeEach(() => {
      mockPageReload();
    });

    it('should use isConfirmationNeeded prop from session storage key "telegram-apps/closing-behavior"', () => {
      const spy = vi.fn(() => '{"isConfirmationNeeded":true}');
      mockSessionStorageGetItem(spy);
      restore();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/closing-behavior');
      expect(isConfirmationNeeded()).toBe(true);
    });

    it('should set isConfirmationNeeded false if session storage key "telegram-apps/closing-behavior" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      restore();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/closing-behavior');
      expect(isConfirmationNeeded()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isConfirmationNeeded false', () => {
      restore();
      expect(isConfirmationNeeded()).toBe(false);
    });
  });
});
