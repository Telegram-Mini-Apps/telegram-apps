import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
  mockMiniAppsEnv,
} from '@test-utils/utils.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';

import {
  mount,
  unmount,
  isSupported,
  isMounted,
  _isMounted,
} from './methods.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
  _isMounted.set(true);
}

// support checks.
describe.each([
  ['mount', mount],
  // ['updateToken', updateToken],
  // ['requestAccess', requestAccess],
  // ['authenticate', authenticate],
  // ['openSettings', openSettings],
] as const)('%s', (name, fn) => {
  testSafety(fn, name, {
    component: 'biometry',
    minVersion: '7.2',
  });
});

describe('isSupported', () => {
  testIsSupported(isSupported, '7.2');
});

describe('unmount', () => {
  beforeEach(setAvailable);

  it('should set isMounted = false', () => {
    expect(isMounted()).toBe(true);
    unmount();
    expect(isMounted()).toBe(false);
  });
});
