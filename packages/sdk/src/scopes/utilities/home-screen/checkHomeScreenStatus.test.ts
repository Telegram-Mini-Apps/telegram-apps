import { beforeEach, describe, vi } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/resetPackageState.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import { checkHomeScreenStatus } from './checkHomeScreenStatus.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe.each([
  ['checkHomeScreenStatus', checkHomeScreenStatus],
] as const)('%s', (name, fn) => {
  testSafety(fn, name, {
    minVersion: '8.0',
  });
});