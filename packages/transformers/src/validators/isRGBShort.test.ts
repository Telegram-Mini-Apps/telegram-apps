import { expect, it } from 'vitest';

import { isRGBShort } from './isRGBShort.js';

it('should return true for correct short RGB representation', () => {
  expect(isRGBShort('#fff')).toBe(true);
});

it('should return false for any other value', () => {
  ['abc', '#ffff', '#ffffff', '#ggg'].forEach((v) => {
    expect(isRGBShort(v)).toBe(false);
  });
});
