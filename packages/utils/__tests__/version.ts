import { expect, test } from 'vitest';
import { compareVersions } from '../src/index.js';

test('version.ts', () => {
  test('compareVersions', () => {
    test('should return 1 in case "a" is greater than "b"', () => {
      expect(compareVersions('6.1', '6.0')).toBe(1);
      expect(compareVersions('6.1', '6')).toBe(1);
    });

    test('should return 0 in case "a" is equal to "b"', () => {
      expect(compareVersions('6', '6')).toBe(0);
      expect(compareVersions('6', '6.0')).toBe(0);
      expect(compareVersions('6.0', '6')).toBe(0);
    });

    test('should return -1 in case "a" is lower than "b"', () => {
      expect(compareVersions('5', '6.0')).toBe(-1);
      expect(compareVersions('6.0', '6.1')).toBe(-1);
    });
  });
});
