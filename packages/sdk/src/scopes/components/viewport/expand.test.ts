import { beforeEach, describe, vi } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/utils.js';
import { mockPostEvent } from '@test-utils/utils.js';

import { expand } from '@/scopes/components/viewport/expand.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe('safety', () => {
  testSafety(expand, 'expand', {
    component: 'viewport',
  });
});
