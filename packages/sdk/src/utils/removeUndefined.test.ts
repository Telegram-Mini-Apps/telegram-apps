import { expect, it } from 'vitest';
import { removeUndefined } from '@/utils/removeUndefined.js';

it('should remove keys with undefined values', () => {
  expect(removeUndefined({
    a: '123',
    b: {},
    c: 123,
    d: '',
    e: 0,
    f: null,
    g: undefined,
  })).toStrictEqual({
    a: '123',
    b: {},
    c: 123,
    d: '',
    e: 0,
    f: null,
  })
});