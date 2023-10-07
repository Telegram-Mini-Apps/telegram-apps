import { describe, expect, it } from 'vitest';
import { boolean } from '../../src/index.js';

describe('parsers', () => {
  describe('boolean.ts', () => {
    describe('boolean', () => {
      it('should return value in case, it has type boolean', () => {
        expect(boolean().parse(true)).toBe(true);
        expect(boolean().parse(false)).toBe(false);
      });

      it('should throw an error in case, passed value is not of type boolean', () => {
        expect(() => boolean().parse('true')).toThrow();
        expect(() => boolean().parse({})).toThrow();
      });

      describe('optional', () => {
        it('should return undefined if value is undefined', () => {
          expect(boolean().optional().parse(undefined)).toBe(undefined);
        });
      });
    });
  });
});
