import { beforeEach, describe, vi } from 'vitest';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import { mount, bindCssVars } from './methods.js';
import { isMounted } from './signals.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe.each([
  ['mount', mount, undefined],
  ['bindCssVars', bindCssVars, isMounted],
] as const)('%s', (name, fn, isMounted) => {
  testSafety(fn, name, {
    component: 'safeArea',
    isMounted,
  });
});
