import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { dispatchMiniAppsEvent, createWindow, type WindowSpy } from 'test-utils';

import { resetPackageState } from '@/resetPackageState.js';
import { subscribe } from '@/events/listening/subscribe.js';

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow();
});

afterEach(() => {
  windowSpy.mockRestore();
  resetPackageState();
});

it('should call listener in case, Telegram event was created', () => {
  const listener = vi.fn();
  subscribe(listener);

  const eventData = {
    height: 123,
    width: 321,
    is_expanded: false,
    is_state_stable: false,
  };
  dispatchMiniAppsEvent('viewport_changed', eventData);

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(['viewport_changed', eventData], undefined);
});

it('should remove listener in case, returned callback was called', () => {
  const listener = vi.fn();
  const emit = () => dispatchMiniAppsEvent('viewport_changed', {
    height: 123,
    width: 321,
    is_expanded: false,
    is_state_stable: false,
  });

  const unsubscribe = subscribe(listener);
  emit();
  expect(listener).toHaveBeenCalledTimes(1);

  unsubscribe();
  emit();
  expect(listener).toHaveBeenCalledTimes(1);
});