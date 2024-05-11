import { expect, it } from 'vitest';

import { toRGB } from './toRGB.js';

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
