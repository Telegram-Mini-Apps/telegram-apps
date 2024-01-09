import { expect, it } from 'vitest';
import { truncate } from '~/viewport/utils.js';

it('should return zero if value is less than 0', () => {
  expect(truncate(-1)).toBe(0);
});

it('should return value if it is equals to or higher than 0', () => {
  expect(truncate(0)).toBe(0);
  expect(truncate(20)).toBe(20);
});