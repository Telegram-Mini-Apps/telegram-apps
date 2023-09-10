import { isRGB, toRGB, isRGBShort, isColorDark } from '../src/index.js';

describe('utils.ts', () => {
  describe('isColorDark', () => {
    it('should return true in case, the value which is equal to Math.sqrt(0.299 * R * R + 0.587 * G * G + 0.114 * B * B) is less than 120 and false otherwise', () => {
      expect(isColorDark('#17212b')).toBe(true);
      expect(isColorDark('#f5f5f5')).toBe(false);
    });

    it('should throw an error in case, passed value has not convertable to RGB format', () => {
      expect(() => isColorDark('abc')).toThrow();
    });
  });

  describe('isRGBShort', () => {
    it('should return true for correct short RGB representation', () => {
      expect(isRGBShort('#fff')).toBe(true);
    });

    it('should return false for any other value', () => {
      ['abc', '#ffff', '#ffffff', '#ggg'].forEach((v) => {
        expect(isRGBShort(v)).toBe(false);
      });
    });
  });

  describe('isRGB', () => {
    it('should return true for correct full RGB representation', () => {
      expect(isRGB('#ffffff')).toBe(true);
    });

    it('should return false for any other value', () => {
      ['abc', '#ffff', '#fff', '#fffffg'].forEach((v) => {
        expect(isRGB(v)).toBe(false);
      });
    });
  });

  describe('toRGB', () => {
    it('should return same value in case, full version of RGB is passed', () => {
      expect(toRGB('#ffffff')).toBe('#ffffff');
    });

    it('should return full RGB value in case, its short presentation is passed', () => {
      expect(toRGB('#abc')).toBe('#aabbcc');
    });

    it('should return RGB representation of rgb(*,*,*) pattern', () => {
      expect(toRGB('rgb(6,56,11)')).toBe('#06380b');
    });

    it('should return RGB representation of rgba(*,*,*) pattern', () => {
      expect(toRGB('rgba(6,56,11,22)')).toBe('#06380b');
    });

    it('should throw an error in other cases', () => {
      expect(() => toRGB('abc')).toThrow();
    });
  });
});
