import { describe, expect, it } from 'vitest';

import { boolean } from '~/parsing/index.js';

it('should return value in case, it has type boolean', () => {
  expect(boolean().parse(true)).toBe(true);
  expect(boolean().parse(false)).toBe(false);
});

it('should return true in case, value string representation equals "1" or "true"', () => {
  expect(boolean().parse(1)).toBe(true);
  expect(boolean().parse('1')).toBe(true);
  expect(boolean().parse('true')).toBe(true);
});

it('should return false in case, value string representation equals "0" or "false"', () => {
  expect(boolean().parse(0)).toBe(false);
  expect(boolean().parse('0')).toBe(false);
  expect(boolean().parse('false')).toBe(false);
});

it('should throw an error in case, passed value is not of type boolean and its string representation is not "0", "1", "true" or "false"', () => {
  expect(() => boolean().parse('true!')).toThrow();
  expect(() => boolean().parse({})).toThrow();
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(boolean().optional().parse(undefined)).toBe(undefined);
  });
});
