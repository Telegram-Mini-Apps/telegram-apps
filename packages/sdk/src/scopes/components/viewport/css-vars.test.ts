import { beforeEach, describe, vi } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/utils.js';
import { mockPostEvent } from '@test-utils/utils.js';

import { _isMounted } from './mounting.js';
import { bindCssVars } from './css-vars.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe('safety', () => {
  testSafety(bindCssVars, 'bindCssVars', {
    component: 'viewport',
    isMounted: _isMounted,
  });
});
