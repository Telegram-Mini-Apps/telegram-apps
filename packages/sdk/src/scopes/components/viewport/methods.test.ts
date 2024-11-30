import { beforeEach, describe, vi } from 'vitest';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import { mount, expand, bindCssVars, exitFullscreen, requestFullscreen } from './methods.js';
import { isMounted } from './signals.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe.each([
  ['mount', mount, undefined, undefined],
  ['expand', expand, undefined, undefined],
  ['bindCssVars', bindCssVars, isMounted, undefined],
  ['exitFullscreen', exitFullscreen, isMounted, '8.0'],
  ['requestFullscreen', requestFullscreen, isMounted, '8.0'],
] as const)('%s', (name, fn, isMounted, minVersion) => {
  testSafety(fn, name, {
    component: 'viewport',
    minVersion,
    isMounted,
  });
});
