import { expect, test } from 'vitest';
import { isRecord } from '../src/index.js';

test('validation.ts', () => {
  test('isRecord', () => {
    test('should return false for non-object value', () => {
      [true, 123, 'abc'].forEach((v) => {
        expect(isRecord(v)).toBe(false);
      });
    });

    test('should return false for null value', () => {
      expect(isRecord(null)).toBe(false);
    });

    test('should return false for array', () => {
      expect(isRecord([])).toBe(false);
    });

    test('should return true for object', () => {
      expect(isRecord({ a: true })).toBe(true);
    });
  });
});
