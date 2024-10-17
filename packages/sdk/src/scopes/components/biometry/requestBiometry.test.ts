import { it, expect, beforeEach, vi, describe } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import { $version } from '@/scopes/globals.js';
import { requestBiometry } from '@/scopes/components/biometry/requestBiometry.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

it('should throw ERR_NOT_SUPPORTED if version is less than 7.2', () => {
  $version.set('7.1');
  expect(requestBiometry).toThrow(new TypedError('ERR_NOT_SUPPORTED'));

  $version.set('7.2');
  expect(requestBiometry).not.toThrow();
});

describe('isSupported', () => {
  it('should return false if version is less than 7.2. True otherwise', () => {
    $version.set('7.1');
    expect(requestBiometry.isSupported()).toBe(false);

    $version.set('7.2');
    expect(requestBiometry.isSupported()).toBe(true);
  });
});
