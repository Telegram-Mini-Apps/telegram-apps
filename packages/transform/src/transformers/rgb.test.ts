import { describe, expect, it } from 'vitest';

import { rgb } from './rgb.js';

it('should return value in case, it represents RGB color', () => {
  expect(rgb()('#fff')).toBe('#ffffff');
});

it('should throw an error in case, passed value is not of type string', () => {
  expect(() => rgb()(true)).toThrow();
  expect(() => rgb()({})).toThrow();
});

it('should throw an error in case, passed value does not represent RGB string', () => {
  expect(() => rgb()('my custom string')).toThrow();
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(rgb(true)(undefined)).toBe(undefined);
  });
});
