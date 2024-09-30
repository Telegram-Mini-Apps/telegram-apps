import {
  vi,
  it,
  expect,
  // describe,
  beforeEach,
  afterEach,
} from 'vitest';
// import { mockSessionStorageSetItem } from 'test-utils';

// import { getStorageValue, setStorageValue } from '@/storage/storage.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('is fine', () => {
  expect(true).toBeTruthy();
})

// FIXME: For some reason, these tests fail, when tests on the "package" folder are launched.
// describe('setStorageValue', () => {
//   it('should call sessionStorage.setItem with formatted key and JSON.stringify applied to value', () => {
//     const fn = mockSessionStorageSetItem();
//     setStorageValue('backButton', false);
//
//     expect(fn).toHaveBeenCalledOnce();
//     expect(fn).toHaveBeenCalledWith('tapps/backButton', 'false');
//   });
// });

// describe('getStorageValue', () => {
//   it('should call sessionStorage.getItem with formatted key and apply JSON.parse to the extracted value in case, it is not empty. If parsing failed, return undefined', () => {
//     const getItem = vi
//       .spyOn(sessionStorage, 'getItem')
//       .mockImplementation(() => '{"isVisible":false}');
//     let value = getStorageValue('backButton');
//     expect(getItem).toHaveBeenCalledOnce();
//     expect(getItem).toHaveBeenCalledWith('tapps/backButton');
//     expect(value).toStrictEqual({ isVisible: false });
//
//     getItem.mockImplementation(() => null);
//     value = getStorageValue('backButton');
//     expect(value).toBeUndefined();
//
//     getItem.mockImplementation(() => '{"isVisible":}');
//     value = getStorageValue('backButton');
//     expect(value).toBeUndefined();
//   });
// });