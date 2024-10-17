import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { $version } from '@/scopes/globals.js';

import {
  isSupported,
  updateToken,
  mount,
  requestAccess,
  authenticate,
  openSettings,
} from './methods.js';
import { isMounted, state } from './signals.js';

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
    state.set({
      available: true,
      type: 'face',
      token: '',
      tokenSaved: true,
      accessGranted: true,
      accessRequested: true,
      deviceId: '',
    });
  });

  it.each([
    { fn: openSettings, name: 'openSettings' },
    { fn: mount, name: 'mount' },
  ])('$name function should throw ERR_NOT_SUPPORTED if version is less than 7.2', ({ fn }) => {
    $version.set('7.1');
    expect(fn).toThrow(new TypedError('ERR_NOT_SUPPORTED'));

    $version.set('7.2');
    expect(fn).not.toThrow(new TypedError('ERR_NOT_SUPPORTED'));
  });
});

describe('mount check', () => {
  beforeEach(() => {
    $version.set('10');
  });

  it.each([
    { fn: requestAccess, name: 'requestAccess' },
    { fn: updateToken, name: 'updateToken' },
  ])('$name function should throw ERR_NOT_MOUNTED if component was not mounted', ({ fn }) => {
    expect(fn).toThrow(new TypedError('ERR_NOT_MOUNTED'));
    isMounted.set(true);
    expect(fn).not.toThrow();
  });

  it("'authenticate' function should throw ERR_NOT_MOUNTED if component was not mounted", async () => {
    expect(authenticate).toThrow(new TypedError('ERR_NOT_MOUNTED'));
    isMounted.set(true);
    await expect(authenticate).rejects.toThrow(new TypedError('ERR_NOT_AVAILABLE'));
  })
});

