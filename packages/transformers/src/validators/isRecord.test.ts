import { expect, it } from 'vitest';

import { isRecord } from '@/validators/isRecord.js';

it('should return false for non-object value', () => {
  [true, 123, 'abc'].forEach((v) => {
    expect(isRecord(v)).toBe(false);
  });
});

it('should return false for null value', () => {
  expect(isRecord(null)).toBe(false);
});

it('should return false for array', () => {
  expect(isRecord([])).toBe(false);
});

it('should return true for object', () => {
  expect(isRecord({ a: true })).toBe(true);
});
