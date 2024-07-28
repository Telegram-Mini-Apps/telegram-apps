import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  state,
  isConfirmationNeeded,
  disableConfirmation,
  enableConfirmation,
} from './ClosingBehavior.js';
import { postEvent } from '@/components/globals.js';
import { postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';

beforeEach(() => {
  // Mock postEvent.
  postEvent.set(() => null);

  // Reset all signals.
  isConfirmationNeeded.set(false);
  isConfirmationNeeded.unsubscribeAll();
  state.unsubscribeAll();

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

describe('state', () => {
  it('should return object with isConfirmationNeeded: boolean', () => {
    expect(state()).toStrictEqual({ isConfirmationNeeded: false });
    isConfirmationNeeded.set(true);
    expect(state()).toStrictEqual({ isConfirmationNeeded: true });
  });
});
