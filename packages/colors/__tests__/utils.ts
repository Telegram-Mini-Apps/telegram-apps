import { expect, test } from 'vitest';
import { isRGB, toRGB, isRGBShort, isColorDark } from '../src/index.js';

test('utils.ts', () => {
  test('isColorDark', () => {
    test('should return true in case, the value which is equal to Math.sqrt(0.299 * R * R + 0.587 * G * G + 0.114 * B * B) is less than 120 and false otherwise', () => {
      expect(isColorDark('#17212b')).toBe(true);
      expect(isColorDark('#f5f5f5')).toBe(false);
    });

    test('should throw an error in case, passed value has not convertable to RGB format', () => {
      expect(() => isColorDark('abc')).toThrow();
    });
  });

  test('isRGBShort', () => {
    test('should return true for correct short RGB representation', () => {
      expect(isRGBShort('#fff')).toBe(true);
    });

    test('should return false for any other value', () => {
      ['abc', '#ffff', '#ffffff', '#ggg'].forEach((v) => {
        expect(isRGBShort(v)).toBe(false);
      });
    });
  });

  test('isRGB', () => {
    test('should return true for correct full RGB representation', () => {
      expect(isRGB('#ffffff')).toBe(true);
    });

    test('should return false for any other value', () => {
      ['abc', '#ffff', '#fff', '#fffffg'].forEach((v) => {
        expect(isRGB(v)).toBe(false);
      });
    });
  });

  test('toRGB', () => {
    test('should return same value in case, full version of RGB is passed', () => {
      expect(toRGB('#ffffff')).toBe('#ffffff');
    });

    test('should return full RGB value in case, its short presentation is passed', () => {
      expect(toRGB('#abc')).toBe('#aabbcc');
    });

    test('should return RGB representation of rgb(*,*,*) pattern', () => {
      expect(toRGB('rgb(6,56,11)')).toBe('#06380b');
    });

    test('should return RGB representation of rgba(*,*,*) pattern', () => {
      expect(toRGB('rgba(6,56,11,22)')).toBe('#06380b');
    });

    test('should throw an error in other cases', () => {
      expect(() => toRGB('abc')).toThrow();
    });
  });
});
