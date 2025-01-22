import { beforeEach, vi, describe } from 'vitest';

import { resetPackageState } from '@test-utils/utils.js';
import { mockPostEvent } from '@test-utils/utils.js';

import { requestBiometry } from './requestBiometry.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe('safety', () => {
  testSafety(requestBiometry, 'requestBiometry', {
    minVersion: '7.2',
  });
});
