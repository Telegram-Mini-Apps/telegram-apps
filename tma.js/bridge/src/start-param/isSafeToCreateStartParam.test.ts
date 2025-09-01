import { expect, it } from 'vitest';

import { isSafeToCreateStartParam } from '@/start-param/isSafeToCreateStartParam.js';

it('should return true if value\'s base64 representation length is less than 513', () => {
  expect(
    isSafeToCreateStartParam(new Array(384)
      .fill('A')
      .join('')),
  ).toBe(true);
});

it('should return false if value\'s base64 representation length exceeds 512', () => {
  expect(
    isSafeToCreateStartParam(new Array(385)
      .fill('A')
      .join('')),
  ).toBe(false);
});
