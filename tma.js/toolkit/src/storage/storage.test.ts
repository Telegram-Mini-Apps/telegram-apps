/* eslint-disable @typescript-eslint/unbound-method */
import { mockSessionStorageGetItem, mockSessionStorageSetItem } from 'test-utils';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { getStorageValue, setStorageValue } from '@/storage/storage.js';

beforeEach(() => {
  if (typeof sessionStorage === 'undefined') {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 0,
      },
      writable: true,
      configurable: true,
    });
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('setStorageValue', () => {
  it(
    'should call sessionStorage.setItem with formatted key and JSON.stringify applied to value',
    () => {
      const setItem = mockSessionStorageSetItem();
      setStorageValue('backButton', false);

      expect(setItem).toHaveBeenCalledOnce();
      expect(setItem).toHaveBeenCalledWith('tapps/backButton', 'false');
    },
  );
});

describe('getStorageValue', () => {
  it(
    'should call sessionStorage.getItem with formatted key and apply JSON.parse to the extracted value in case, it is not empty. If parsing failed, return undefined',
    () => {
      const getItem = mockSessionStorageGetItem(() => '{"isVisible":false}');
      let value = getStorageValue('backButton');
      expect(getItem).toHaveBeenCalledOnce();
      expect(getItem).toHaveBeenCalledWith('tapps/backButton');
      expect(value).toStrictEqual({ isVisible: false });

      getItem.mockImplementation(() => null);
      value = getStorageValue('backButton');
      expect(value).toBeUndefined();

      getItem.mockImplementation(() => '{"isVisible":}');
      value = getStorageValue('backButton');
      expect(value).toBeUndefined();
    },
  );
});
