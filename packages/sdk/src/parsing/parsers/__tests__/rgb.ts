import { describe, expect, it } from 'vitest';

import { rgb } from '../rgb';

it('should return value in case, it represents RGB color', () => {
  expect(rgb().parse('#fff')).toBe('#ffffff');
});

it('should throw an error in case, passed value is not of type string', () => {
  expect(() => rgb().parse(true)).toThrow();
  expect(() => rgb().parse({})).toThrow();
});

it('should throw an error in case, passed value does not represent RGB string', () => {
  expect(() => rgb().parse('my custom string')).toThrow();
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(rgb().optional().parse(undefined)).toBe(undefined);
  });
});
