import { describe, expect, it } from 'vitest';

import { boolean } from './boolean.js';

it('should return value in case, it has type boolean', () => {
  expect(boolean()(true)).toBe(true);
  expect(boolean()(false)).toBe(false);
});

it('should return true in case, value string representation equals "1" or "true"', () => {
  expect(boolean()(1)).toBe(true);
  expect(boolean()('1')).toBe(true);
  expect(boolean()('true')).toBe(true);
});

it('should return false in case, value string representation equals "0" or "false"', () => {
  expect(boolean()(0)).toBe(false);
  expect(boolean()('0')).toBe(false);
  expect(boolean()('false')).toBe(false);
});

it('should throw an error in case, passed value is not of type boolean and its string representation is not "0", "1", "true" or "false"', () => {
  expect(() => boolean()('true!')).toThrow();
  expect(() => boolean()({})).toThrow();
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(boolean(true)(undefined)).toBe(undefined);
  });
});
