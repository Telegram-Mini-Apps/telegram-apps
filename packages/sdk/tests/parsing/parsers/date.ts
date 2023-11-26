import { describe, expect, it } from 'vitest';

import { date } from '~/parsing/index.js';

it('should return value in case, it is instance of Date', () => {
  const d = new Date();
  expect(date().parse(d)).toBe(d);
});

it('should throw an error in case, passed value cannot be converted to number', () => {
  expect(() => date().parse('true')).toThrow();
  expect(() => date().parse({})).toThrow();
});

it('should create date multiplying value by 1000 in case this value can be converted to number', () => {
  const a = new Date(1000);
  expect(date().parse('1')).toStrictEqual(a);
  expect(date().parse(1)).toStrictEqual(a);
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(date().optional().parse(undefined)).toBe(undefined);
  });
});
