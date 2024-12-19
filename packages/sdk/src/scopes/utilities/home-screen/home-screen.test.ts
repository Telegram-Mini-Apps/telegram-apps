import { beforeEach, describe, vi } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import {
  addToHomeScreen,
  onAddedToHomeScreen,
  offAddedToHomeScreen,
  checkHomeScreenStatus,
} from './home-screen.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe('safety', () => {
  testSafety(addToHomeScreen, 'addToHomeScreen', { minVersion: '8.0' });
});

describe.each([
  ['addToHomeScreen', addToHomeScreen],
  ['onAddedToHomeScreen', onAddedToHomeScreen],
  ['offAddedToHomeScreen', offAddedToHomeScreen],
  ['checkHomeScreenStatus', checkHomeScreenStatus],
] as const)('%s', (name, fn) => {
  testSafety(fn, name, {
    minVersion: '8.0',
  });
});