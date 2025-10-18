/* eslint-disable @typescript-eslint/unbound-method */
import { mockSessionStorageSetItem } from 'test-utils';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { getStorageValue, setStorageValue } from '@/storage/storage.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('setStorageValue', () => {
  it(
    'should call sessionStorage.setItem with formatted key and JSON.stringify applied to value',
    () => {
      mockSessionStorageSetItem();
      setStorageValue('backButton', false);

      expect(sessionStorage.setItem).toHaveBeenCalledOnce();
      expect(sessionStorage.setItem).toHaveBeenCalledWith('tapps/backButton', 'false');
    },
  );
});

describe('getStorageValue', () => {
  it(
    'should call sessionStorage.getItem with formatted key and apply JSON.parse to the extracted value in case, it is not empty. If parsing failed, return undefined',
    () => {
      console.log('Window session storage', window.sessionStorage);
      console.log('Session storage', sessionStorage);
      console.log('Get item', sessionStorage.getItem);
      const getItem = vi
        .spyOn(sessionStorage, 'getItem')
        .mockImplementation(() => '{"isVisible":false}');
      console.log('Mock', getItem);
      console.log('Session storage 2', sessionStorage);
      console.log('Get item 2', sessionStorage.getItem);
      let value = getStorageValue('backButton');
      expect(sessionStorage.getItem).toHaveBeenCalledOnce();
      expect(sessionStorage.getItem).toHaveBeenCalledWith('tapps/backButton');
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
