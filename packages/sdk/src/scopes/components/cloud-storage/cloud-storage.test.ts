import { beforeEach, describe, expect, it } from 'vitest';
import { emitMiniAppsEvent, TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setInitialized } from '@test-utils/setInitialized.js';
import { $createRequestId, $version } from '@/scopes/globals.js';

import {
  isSupported,
  getItem,
  deleteItem,
  setItem,
  getKeys,
} from './cloud-storage.js';

beforeEach(() => {
  resetPackageState();
  mockPostEvent();
});

describe('check support', () => {
  describe.each([
    { name: 'getItem', fn: getItem },
    { name: 'deleteItem', fn: deleteItem },
    { name: 'setItem', fn: setItem },
    { name: 'getKeys', fn: getKeys },
  ])('$name', ({ fn, name }) => {
    it('should throw ERR_NOT_SUPPORTED if version is less than 6.9', () => {
      const error = new TypedError(
        'ERR_NOT_SUPPORTED',
        `cloudStorage.${name}() method is not supported in Mini Apps version 6.8`,
      );
      $version.set('6.8');
      expect(fn).toThrow(error);
      $version.set('6.9');
      expect(fn).not.toThrow(error);
    });

    describe('isSupported', () => {
      it('should return false if version is less than 6.9', () => {
        $version.set('6.8');
        expect(fn.isSupported()).toBe(false);

        $version.set('6.9');
        expect(fn.isSupported()).toBe(true);
      });
    });
  });
});

describe('deleteItem', () => {
  beforeEach(setInitialized);

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
  beforeEach(setInitialized);

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
  beforeEach(setInitialized);

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
  beforeEach(setInitialized);

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
