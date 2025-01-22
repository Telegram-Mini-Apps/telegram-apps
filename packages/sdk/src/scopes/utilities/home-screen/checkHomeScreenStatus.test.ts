import { beforeEach, describe, vi } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState, mockPostEvent } from '@test-utils/utils.js';

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