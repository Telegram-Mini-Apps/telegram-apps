/* eslint-disable @typescript-eslint/unbound-method */
import { mockSessionStorageSetItem } from 'test-utils';
import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { getStorageValue, setStorageValue } from '@/storage/storage.js';

beforeEach(() => {
  vi.restoreAllMocks();
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
      console.log('test frozen', Object.isFrozen(sessionStorage));
      const getItem = vi
        .spyOn(sessionStorage, 'getItem')
        .mockImplementation(() => '{"isVisible":false}');
      let value = getStorageValue('backButton');
      console.log('test field', sessionStorage.testField);
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
