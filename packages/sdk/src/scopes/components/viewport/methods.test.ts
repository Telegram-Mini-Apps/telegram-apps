import { beforeEach, describe, vi } from 'vitest';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import { mount, expand, bindCssVars } from './methods.js';
import { isMounted } from './signals.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe.each([
  ['mount', mount, undefined],
  ['expand', expand, undefined],
  ['bindCssVars', bindCssVars, isMounted],
] as const)('%s', (name, fn, isMounted) => {
  testSafety(fn, name, {
    component: 'viewport',
    isMounted,
  });
});
