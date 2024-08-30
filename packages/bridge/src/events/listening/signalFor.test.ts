import { afterEach, beforeEach, expect, it } from 'vitest';
import { createWindow } from 'test-utils';

import { resetPackageState } from '@/resetPackageState.js';
import { signalFor } from '@/events/listening/signalFor.js';

beforeEach(() => {
  createWindow();
});

afterEach(() => {
  resetPackageState();
});

it('should return same signal for same event', () => {
  expect(signalFor('viewport_changed')).toBe(signalFor('viewport_changed'));
});