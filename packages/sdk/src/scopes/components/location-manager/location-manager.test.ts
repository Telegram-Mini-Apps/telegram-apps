import { beforeEach, describe, vi } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import {
  openSettings,
  requestLocation,
  mount,
  _isMounted,
} from '@/scopes/components/location-manager/location-manager.js';
import { mockPostEvent, resetPackageState } from '@test-utils/utils.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe.each([
  ['requestLocation', requestLocation, _isMounted],
  ['openSettings', openSettings, undefined],
  ['mount', mount, undefined],
] as const)('%s', (name, fn, isMounted) => {
  testSafety(fn, name, {
    component: 'locationManager',
    minVersion: '8.0',
    isMounted,
  });
});
