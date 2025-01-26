import { beforeEach, describe, vi } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { resetPackageState } from '@test-utils/utils.js';
import { mockPostEvent } from '@test-utils/utils.js';

import { _isMounted } from './mounting.js';
import { requestFullscreen, exitFullscreen } from './fullscreen.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe.each([
  ['requestFullscreen', requestFullscreen],
  ['exitFullscreen', exitFullscreen],
] as const)('%s', (name, fn) => {
  testSafety(fn, name, {
    component: 'viewport',
    minVersion: '8.0',
    isMounted: _isMounted,
  });
});
