import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { dispatchMiniAppsEvent, createWindow, type WindowSpy } from 'test-utils';

import { resetPackageState } from '@/resetPackageState.js';
import { on } from '@/events/listening/on.js';


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
  on('viewport_changed', listener);

  const eventData = {
    height: 123,
    width: 321,
    is_expanded: false,
    is_state_stable: false,
  };
  dispatchMiniAppsEvent('viewport_changed', eventData);

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(eventData, undefined);
});

it('should remove listener after being called if "once" option was passed', () => {
  const listener = vi.fn();
  on('viewport_changed', listener, true);

  const eventData = {
    height: 123,
    width: 321,
    is_expanded: false,
    is_state_stable: false,
  };
  dispatchMiniAppsEvent('viewport_changed', eventData);
  dispatchMiniAppsEvent('viewport_changed', eventData);

  expect(listener).toHaveBeenCalledTimes(1);
});

it('should remove listener in case, returned callback was called', () => {
  const listener = vi.fn();
  const emit = () => dispatchMiniAppsEvent('viewport_changed', {
    height: 123,
    width: 321,
    is_expanded: false,
    is_state_stable: false,
  });

  const off = on('viewport_changed', listener);
  emit();
  expect(listener).toHaveBeenCalledTimes(1);

  off();
  emit();
  expect(listener).toHaveBeenCalledTimes(1);
});