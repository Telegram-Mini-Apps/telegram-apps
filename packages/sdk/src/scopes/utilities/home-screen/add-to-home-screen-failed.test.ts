import { beforeEach, describe, vi } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/resetPackageState.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import {
  offAddToHomeScreenFailed,
  onAddToHomeScreenFailed
} from './add-to-home-screen-failed.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe.each([
  ['offAddToHomeScreenFailed', offAddToHomeScreenFailed],
  ['onAddToHomeScreenFailed', onAddToHomeScreenFailed],
] as const)('%s', (name, fn) => {
  testSafety(fn, name, {
    minVersion: '8.0',
  });
});