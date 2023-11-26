import { describe, expect, it } from 'vitest';

import { string } from '../../src/index.js';

it('should return value in case, it has type string', () => {
  expect(string().parse('abc')).toBe('abc');
});

it('should convert value to string in case, it has type number', () => {
  expect(string().parse(1)).toBe('1');
});

it('should throw an error in case, passed value is not string or number', () => {
  expect(() => string().parse({})).toThrow();
  expect(() => string().parse([])).toThrow();
  expect(() => string().parse(false)).toThrow();
  expect(() => string().parse(null)).toThrow();
  expect(() => string().parse(undefined)).toThrow();
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(string().optional().parse(undefined)).toBe(undefined);
  });
});
