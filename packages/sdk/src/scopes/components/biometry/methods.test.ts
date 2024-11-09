import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setInitialized } from '@test-utils/setInitialized.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { $version } from '@/scopes/globals.js';

import {
  mount,
  unmount,
  isSupported,
} from './methods.js';
import {
  isMounted,
} from './signals.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setInitialized();
  mockMiniAppsEnv();
  isMounted.set(true);
}

// support checks.
describe.each([
  ['mount', mount],
  // ['updateToken', updateToken],
  // ['requestAccess', requestAccess],
  // ['authenticate', authenticate],
  // ['openSettings', openSettings],
] as const)('%s', (name, fn) => {
  it('should throw ERR_UNKNOWN_ENV if not in Mini Apps', () => {
    const err = new TypedError(
      'ERR_UNKNOWN_ENV',
      `Unable to call the biometry.${name}() method: it can't be called outside Mini Apps`,
    );
    expect(fn).toThrow(err);
    mockMiniAppsEnv();
    expect(fn).not.toThrow(err);
  });

  describe('mini apps env', () => {
    beforeEach(mockMiniAppsEnv);

    it('should throw ERR_UNKNOWN_ENV if called on the server', () => {
      mockSSR();
      expect(fn).toThrow(
        new TypedError(
          'ERR_UNKNOWN_ENV',
          `Unable to call the biometry.${name}() method: it can't be called outside Mini Apps`,
        ),
      );
    });

    it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
      const err = new TypedError(
        'ERR_NOT_INITIALIZED',
        `Unable to call the biometry.${name}() method: the SDK was not initialized. Use the SDK init() function`,
      );
      expect(fn).toThrow(err);
      setInitialized();
      expect(fn).not.toThrow(err);
    });

    // fixme
    // describe('package initialized', () => {
    //   beforeEach(setInitialized);
    //
    //   it('should throw ERR_NOT_SUPPORTED if Mini Apps version is less than 7.2', () => {
    //     $version.set('7.1');
    //     expect(fn).toThrow(
    //       new TypedError(
    //         'ERR_NOT_SUPPORTED',
    //         `Unable to call the biometry.${name}() method: it is unsupported in Mini Apps version 7.1`,
    //       ),
    //     );
    //     $version.set('7.2');
    //     expect(fn).not.toThrow(
    //       new TypedError(
    //         'ERR_NOT_SUPPORTED',
    //         `Unable to call the biometry.${name}() method: it is unsupported in Mini Apps version 7.2`,
    //       ),
    //     );
    //   });
    // });
  });
});

describe('isSupported', () => {
  it('should return false if version is less than 7.2', () => {
    $version.set('7.1');
    expect(isSupported()).toBe(false);

    $version.set('7.2');
    expect(isSupported()).toBe(true);
  });
});

describe('unmount', () => {
  beforeEach(setAvailable);

  it('should set isMounted = false', () => {
    expect(isMounted()).toBe(true);
    unmount();
    expect(isMounted()).toBe(false);
  });
});
