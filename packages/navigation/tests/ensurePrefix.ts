import { describe, expect, it } from 'vitest';
import { ensurePrefix } from '../src/ensurePrefix.js';

describe('ensurePrefix.ts', () => {
  describe('ensurePrefix', () => {
    it('should return the same string if it already has specified prefix', () => {
      expect(ensurePrefix('/abc', '/')).toBe('/abc');
    });

    it('should prepend specified prefix in case, passed string does not have it', () => {
      expect(ensurePrefix('abc', '/')).toBe('/abc');
    });
  });
});
