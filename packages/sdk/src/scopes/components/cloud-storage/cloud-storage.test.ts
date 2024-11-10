import { beforeEach, describe, expect, it, vi } from 'vitest';
import { emitMiniAppsEvent, TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { $createRequestId, $version } from '@/scopes/globals.js';

import {
  setItem,
  getKeys,
  deleteItem,
  getItem,
  isSupported,
} from './cloud-storage.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
}

describe.each([
  ['setItem', setItem],
  ['getKeys', getKeys],
  ['deleteItem', deleteItem],
  ['getItem', getItem],
] as const)('%s', (name, fn) => {
  it('should throw ERR_UNKNOWN_ENV if not in Mini Apps', () => {
    const err = new TypedError(
      'ERR_UNKNOWN_ENV',
      `Unable to call the cloudStorage.${name}() method: it can't be called outside Mini Apps`,
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
          `Unable to call the cloudStorage.${name}() method: it can't be called outside Mini Apps`,
        ),
      );
    });

    it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
      const err = new TypedError(
        'ERR_NOT_INITIALIZED',
        `Unable to call the cloudStorage.${name}() method: the SDK was not initialized. Use the SDK init() function`,
      );
      expect(fn).toThrow(err);
      setMaxVersion();
      expect(fn).not.toThrow(err);
    });

    describe('package initialized', () => {
      beforeEach(setMaxVersion);

      it('should throw ERR_NOT_SUPPORTED if Mini Apps version is less than 6.9', () => {
        $version.set('6.8');
        expect(fn).toThrow(
          new TypedError(
            'ERR_NOT_INITIALIZED',
            `Unable to call the cloudStorage.${name}() method: it is unsupported in Mini Apps version 6.8`,
          ),
        );
        $version.set('6.9');
        expect(fn).not.toThrow(
          new TypedError(
            'ERR_NOT_INITIALIZED',
            `Unable to call the cloudStorage.${name}() method: it is unsupported in Mini Apps version 6.9`,
          ),
        );
      });

      describe('Mini Apps version is 6.9', () => {
        beforeEach(() => {
          $version.set('6.9');
        });

        it('should not throw', () => {
          expect(fn).not.toThrow();
        });
      });
    });
  });

  describe('isSupported', () => {
    it('should return true only if Mini Apps version is 6.9 or higher. False otherwise', () => {
      $version.set('6.8');
      expect(fn.isSupported()).toBe(false);
      $version.set('6.9');
      expect(fn.isSupported()).toBe(true);
    });
  });
});

describe('deleteItem', () => {
  beforeEach(setAvailable);

  it('should call "web_app_invoke_custom_method" with method "deleteStorageValues", params.keys = string[] and req_id. Wait for "custom_method_invoked" event', async () => {
    $createRequestId.set(() => 'temp');
    const spy = mockPostEvent();
    const promise = deleteItem(['a', 'b']);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_invoke_custom_method', {
      method: 'deleteStorageValues',
      params: {
        keys: ['a', 'b'],
      },
      req_id: 'temp',
    });

    emitMiniAppsEvent('custom_method_invoked', {
      req_id: 'temp',
      result: '',
    });

    await expect(promise).resolves.toBe('');
  });
});

describe('getItem', () => {
  beforeEach(setAvailable);

  it('should call "web_app_invoke_custom_method" with method "getStorageValues", params.keys = string[] and req_id. Wait for "custom_method_invoked" event', async () => {
    $createRequestId.set(() => 'temp');
    const spy = mockPostEvent();
    const promise = getItem(['a', 'b']);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_invoke_custom_method', {
      method: 'getStorageValues',
      params: {
        keys: ['a', 'b'],
      },
      req_id: 'temp',
    });

    emitMiniAppsEvent('custom_method_invoked', {
      req_id: 'temp',
      result: {
        a: '123',
        b: '',
      },
    });

    await expect(promise).resolves.toStrictEqual({
      a: '123',
      b: '',
    });
  });
});

describe('getKeys', () => {
  beforeEach(setAvailable);

  it('should call "web_app_invoke_custom_method" with method "getStorageKeys", params = {} and req_id. Wait for "custom_method_invoked" event', async () => {
    $createRequestId.set(() => 'temp');
    const spy = mockPostEvent();
    const promise = getKeys();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_invoke_custom_method', {
      method: 'getStorageKeys',
      params: {},
      req_id: 'temp',
    });

    emitMiniAppsEvent('custom_method_invoked', {
      req_id: 'temp',
      result: ['a', 'b'],
    });

    await expect(promise).resolves.toStrictEqual(['a', 'b']);
  });
});

describe('setItem', () => {
  beforeEach(setAvailable);

  it('should call "web_app_invoke_custom_method" with method "saveStorageValue", params = { key, value } and req_id. Wait for "custom_method_invoked" event', async () => {
    $createRequestId.set(() => 'temp');
    const spy = mockPostEvent();
    const promise = setItem('key', 'value');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_invoke_custom_method', {
      method: 'saveStorageValue',
      params: {
        key: 'key',
        value: 'value',
      },
      req_id: 'temp',
    });

    emitMiniAppsEvent('custom_method_invoked', {
      req_id: 'temp',
      result: '',
    });

    await expect(promise).resolves.toBe('');
  });
});

describe('isSupported', () => {
  it('should return false if version is less than 6.9', () => {
    $version.set('6.8');
    expect(isSupported()).toBe(false);

    $version.set('6.9');
    expect(isSupported()).toBe(true);
  });
});
