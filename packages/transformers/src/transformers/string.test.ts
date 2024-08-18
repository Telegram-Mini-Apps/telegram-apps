import { describe, expect, it } from 'vitest';

import { string } from './string.js';

it('should return value in case, it has type string', () => {
  expect(string()('abc')).toBe('abc');
});

it('should convert value to string in case, it has type number', () => {
  expect(string()(1)).toBe('1');
});

it('should throw an error in case, passed value is not string or number', () => {
  expect(() => string()({})).toThrow();
  expect(() => string()([])).toThrow();
  expect(() => string()(false)).toThrow();
  expect(() => string()(null)).toThrow();
  expect(() => string()(undefined)).toThrow();
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(string(true)(undefined)).toBe(undefined);
  });
});
