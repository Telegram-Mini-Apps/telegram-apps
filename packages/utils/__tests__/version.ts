import { describe, expect, it } from '@jest/globals';
import { compareVersions } from '../src';

describe('version.ts', () => {
  describe('compareVersions', () => {
    it('should return 1 in case "a" is greater than "b"', () => {
      expect(compareVersions('6.1', '6.0')).toBe(1);
      expect(compareVersions('6.1', '6')).toBe(1);
    });

    it('should return 0 in case "a" is equal to "b"', () => {
      expect(compareVersions('6', '6')).toBe(0);
      expect(compareVersions('6', '6.0')).toBe(0);
      expect(compareVersions('6.0', '6')).toBe(0);
    });

    it('should return -1 in case "a" is lower than "b"', () => {
      expect(compareVersions('5', '6.0')).toBe(-1);
      expect(compareVersions('6.0', '6.1')).toBe(-1);
    });
  });
});
