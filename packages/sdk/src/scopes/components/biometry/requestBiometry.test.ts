import { it, expect, beforeEach, vi, describe } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { $version } from '@/scopes/globals.js';

import { requestBiometry } from './requestBiometry.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

it('should throw ERR_UNKNOWN_ENV if not in Mini Apps', () => {
  const err = new TypedError(
    'ERR_UNKNOWN_ENV',
    `Unable to call the requestBiometry() function: it can't be called outside Mini Apps`,
  );
  expect(requestBiometry).toThrow(err);
  mockMiniAppsEnv();
  expect(requestBiometry).not.toThrow(err);
});

describe('mini apps env', () => {
  beforeEach(mockMiniAppsEnv);

  it('should throw ERR_UNKNOWN_ENV if called on the server', () => {
    mockSSR();
    expect(requestBiometry).toThrow(
      new TypedError(
        'ERR_UNKNOWN_ENV',
        `Unable to call the requestBiometry() function: it can't be called outside Mini Apps`,
      ),
    );
  });

  it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
    const err = new TypedError(
      'ERR_NOT_INITIALIZED',
      `Unable to call the requestBiometry() function: the SDK was not initialized. Use the SDK init() function`,
    );
    expect(requestBiometry).toThrow(err);
    setMaxVersion();
    expect(requestBiometry).not.toThrow(err);
  });

  describe('package initialized', () => {
    beforeEach(setMaxVersion);

    it('should throw ERR_NOT_SUPPORTED if Mini Apps version is less than 7.2', () => {
      $version.set('7.1');
      expect(requestBiometry).toThrow(
        new TypedError(
          'ERR_NOT_SUPPORTED',
          `Unable to call the requestBiometry() function: it is unsupported in Mini Apps version 7.1`,
        ),
      );
      $version.set('7.2');
      expect(requestBiometry).not.toThrow(
        new TypedError(
          'ERR_NOT_SUPPORTED',
          `Unable to call the requestBiometry() function: it is unsupported in Mini Apps version 7.2`,
        ),
      );
    });
  });
});

describe('isSupported', () => {
  it('should return true only if Mini Apps version is 7.2 or higher', () => {
    $version.set('7.1');
    expect(requestBiometry.isSupported()).toBe(false);
    $version.set('7.2');
    expect(requestBiometry.isSupported()).toBe(true);
  });
});
