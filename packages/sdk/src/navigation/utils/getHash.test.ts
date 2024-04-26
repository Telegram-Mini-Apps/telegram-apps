import { expect, it } from 'vitest';

import { getHash } from './getHash.js';

it('should return part after the first hash tag. If hash is missing, return null', () => {
  expect(getHash('abc#my-hash')).toBe('my-hash');
  expect(getHash('#my-hash')).toBe('my-hash');
  expect(getHash('#my-hash#my-hash')).toBe('my-hash#my-hash');
  expect(getHash('my-hash')).toBe(null);
});
