import { describe, expect, it } from 'vitest';

import { number } from './number.js';

it('should return value in case, it has type number', () => {
  expect(number()(9992)).toBe(9992);
});

it('should return value converted to number in case, it is number converted to string', () => {
  expect(number()('9992')).toBe(9992);
});

it('should throw an error in case, passed value is not of type number or does not represent number converted to string', () => {
  expect(() => number()(true)).toThrow();
  expect(() => number()('vvv')).toThrow();
  expect(() => number()({})).toThrow();
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(number(true)(undefined)).toBe(undefined);
  });
});
