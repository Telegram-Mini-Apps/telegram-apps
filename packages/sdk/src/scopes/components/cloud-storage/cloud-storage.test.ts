import { beforeEach, describe, expect, it, vi } from 'vitest';
import { emitEvent } from '@telegram-apps/bridge';

import {
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
  mockMiniAppsEnv,
} from '@test-utils/utils.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';

import {
  setItem,
  getKeys,
  deleteItem,
  getItem,
  isSupported,
  clear,
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
  ['clear', clear],
] as const)('%s', (name, fn) => {
  testSafety(fn, name, {
    component: 'cloudStorage',
    minVersion: '6.9',
  });
});

describe('deleteItem', () => {
  beforeEach(setAvailable);

  it(
    'should call "web_app_invoke_custom_method" with method "deleteStorageValues", params.keys = string[] and req_id. Wait for "custom_method_invoked" event',
    async () => {
      const spy = mockPostEvent();
      const promise = deleteItem(['a', 'b']);
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('web_app_invoke_custom_method', {
        method: 'deleteStorageValues',
        params: {
          keys: ['a', 'b'],
        },
        req_id: '1',
      });

      emitEvent('custom_method_invoked', {
        req_id: '1',
        result: '',
      });

      await expect(promise).resolves.toBe('');
    },
  );
});

describe('getItem', () => {
  beforeEach(setAvailable);

  it(
    'should call "web_app_invoke_custom_method" with method "getStorageValues", params.keys = string[] and req_id. Wait for "custom_method_invoked" event',
    async () => {
      const spy = mockPostEvent();
      const promise = getItem(['a', 'b']);
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('web_app_invoke_custom_method', {
        method: 'getStorageValues',
        params: {
          keys: ['a', 'b'],
        },
        req_id: '1',
      });

      emitEvent('custom_method_invoked', {
        req_id: '1',
        result: {
          a: '123',
          b: '',
        },
      });

      await expect(promise).resolves.toStrictEqual({
        a: '123',
        b: '',
      });
    },
  );

  it('should return a string value if a string value was passed', async () => {
    mockPostEvent();
    const promise = getItem('a');
    emitEvent('custom_method_invoked', {
      req_id: '1',
      result: { a: '123' },
    });

    await expect(promise).resolves.toBe('123');
  });

  it(
    'should return a record with passed keys and string values if array of values is passed',
    async () => {
      mockPostEvent();
      const promise = getItem(['a', 'b']);
      emitEvent('custom_method_invoked', {
        req_id: '1',
        result: { a: '123' },
      });

      await expect(promise).resolves.toStrictEqual({ a: '123', b: '' });
    },
  );
});

describe('getKeys', () => {
  beforeEach(setAvailable);

  it(
    'should call "web_app_invoke_custom_method" with method "getStorageKeys", params = {} and req_id. Wait for "custom_method_invoked" event',
    async () => {
      const spy = mockPostEvent();
      const promise = getKeys();
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('web_app_invoke_custom_method', {
        method: 'getStorageKeys',
        params: {},
        req_id: '1',
      });

      emitEvent('custom_method_invoked', {
        req_id: '1',
        result: ['a', 'b'],
      });

      await expect(promise).resolves.toStrictEqual(['a', 'b']);
    },
  );
});

describe('setItem', () => {
  beforeEach(setAvailable);

  it(
    'should call "web_app_invoke_custom_method" with method "saveStorageValue", params = { key, value } and req_id. Wait for "custom_method_invoked" event',
    async () => {
      const spy = mockPostEvent();
      const promise = setItem('key', 'value');
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('web_app_invoke_custom_method', {
        method: 'saveStorageValue',
        params: {
          key: 'key',
          value: 'value',
        },
        req_id: '1',
      });

      emitEvent('custom_method_invoked', {
        req_id: '1',
        result: '',
      });

      await expect(promise).resolves.toBe('');
    },
  );
});

describe('isSupported', () => {
  testIsSupported(isSupported, '6.9');
});
