import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { $version } from '@/scopes/globals.js';

import {
  isSupported,
  unmount,
  updateToken,
  mount,
  requestAccess,
  authenticate,
  openSettings,
} from './methods.js';
import { isMounted } from './signals.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe('isSupported', () => {
  it('should return false if version is less than 7.2. True otherwise', () => {
    $version.set('7.1');
    expect(isSupported()).toBe(false);

    $version.set('7.2');
    expect(isSupported()).toBe(true);
  });
});

describe('support check', () => {
  beforeEach(() => {
    isMounted.set(true);
  });

  it.each([
    { fn: openSettings, name: 'openSettings' },
    { fn: requestAccess, name: 'requestAccess' },
    { fn: unmount, name: 'unmount' },
    { fn: updateToken, name: 'updateToken' },
    { fn: mount, name: 'mount' },
  ])('$name function should throw ERR_NOT_SUPPORTED if version is less than 7.2', ({ fn }) => {
    $version.set('7.1');
    expect(fn).toThrow(new TypedError('ERR_NOT_SUPPORTED'));

    $version.set('7.2');
    expect(fn).not.toThrow(new TypedError('ERR_NOT_SUPPORTED'));
  });

  it("'authenticate' function should throw ERR_NOT_SUPPORTED if version is less than 7.2", async () => {
    $version.set('7.1');
    expect(authenticate).toThrow(new TypedError('ERR_NOT_SUPPORTED'));

    $version.set('7.2');
    await expect(authenticate).rejects.toThrow(new TypedError('ERR_NOT_AVAILABLE'));
  })
});