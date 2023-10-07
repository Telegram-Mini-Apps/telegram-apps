import { describe, expect, it } from 'vitest';
import { number } from '../../src/index.js';

describe('parsers', () => {
  describe('number.ts', () => {
    describe('number', () => {
      it('should return value in case, it has type number', () => {
        expect(number().parse(9992)).toBe(9992);
      });

      it('should return value converted to number in case, it is number converted to string', () => {
        expect(number().parse('9992')).toBe(9992);
      });

      it('should throw an error in case, passed value is not of type number or does not represent number converted to string', () => {
        expect(() => number().parse(true)).toThrow();
        expect(() => number().parse('vvv')).toThrow();
        expect(() => number().parse({})).toThrow();
      });

      describe('optional', () => {
        it('should return undefined if value is undefined', () => {
          expect(number().optional().parse(undefined)).toBe(undefined);
        });
      });
    });
  });
});
