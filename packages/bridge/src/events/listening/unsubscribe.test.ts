import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { dispatchMiniAppsEvent, createWindow, type WindowSpy } from 'test-utils';

import { resetPackageState } from '@/resetPackageState.js';
import { subscribe } from '@/events/listening/subscribe.js';
import { unsubscribe } from '@/events/listening/unsubscribe.js';

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow();
});

afterEach(() => {
  windowSpy.mockRestore();
  resetPackageState();
});

it('should remove listener', () => {
  const listener = vi.fn();
  const emit = () => dispatchMiniAppsEvent('viewport_changed', {
    height: 123,
    width: 321,
    is_expanded: false,
    is_state_stable: false,
  });

  subscribe(listener);
  emit();
  expect(listener).toHaveBeenCalledTimes(1);

  unsubscribe(listener);
  emit();
  expect(listener).toHaveBeenCalledTimes(1);
});