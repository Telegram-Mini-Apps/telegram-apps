import { expect, it } from 'vitest';

import { isRGB } from './isRGB.js';

it('should return true for correct full RGB representation', () => {
  expect(isRGB('#ffffff')).toBe(true);
});

it('should return false for any other value', () => {
  ['abc', '#ffff', '#fff', '#fffffg'].forEach((v) => {
    expect(isRGB(v)).toBe(false);
  });
});
