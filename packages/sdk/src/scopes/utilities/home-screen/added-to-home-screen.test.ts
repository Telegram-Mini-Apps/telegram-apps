import { beforeEach, describe, vi } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/resetPackageState.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import {
  offAddedToHomeScreen,
  onAddedToHomeScreen
} from './added-to-home-screen.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe.each([
  ['offAddedToHomeScreen', offAddedToHomeScreen],
  ['onAddedToHomeScreen', onAddedToHomeScreen],
] as const)('%s', (name, fn) => {
  testSafety(fn, name, {
    minVersion: '8.0',
  });
});