import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { dispatchMiniAppsEvent, createWindow, type WindowSpy } from 'test-utils';

import { resetPackageState } from '@/resetPackageState.js';
import { on } from '@/events/listening/on.js';
import { off } from '@/events/listening/off.js';

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

  on('viewport_changed', listener);
  emit();
  expect(listener).toHaveBeenCalledTimes(1);

  off('viewport_changed', listener);
  emit();
  expect(listener).toHaveBeenCalledTimes(1);
});