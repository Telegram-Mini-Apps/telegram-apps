import {describe, expect, it} from '@jest/globals';
import {
  parseJsonParamAsBool,
  parseJsonParamAsNum,
  parseJsonParamAsOptBool,
  parseJsonParamAsOptNum, parseJsonParamAsOptRGB,
  parseJsonParamAsOptString,
  parseJsonParamAsRecord,
  parseJsonParamAsString,
} from './parsers';

describe('parsing', () => {
  describe('json', () => {
    describe('parsers', () => {
      describe('parseJsonParamAsRecord', () => {
        it('should throw an error in case passed value is not record', () => {
          expect(() => parseJsonParamAsRecord(123)).toThrow();
        });

        it('should return passed value in case it is record', () => {
          expect(parseJsonParamAsRecord({a: true})).toStrictEqual({a: true});
        });
      });

      describe('parseJsonParamAsNum', () => {
        it('should throw an error in case passed value is not number', () => {
          expect(() => parseJsonParamAsNum('Hey!')).toThrow();
        });

        it('should return passed value in case it is number', () => {
          expect(parseJsonParamAsNum(999)).toBe(999);
        });
      });

      describe('parseJsonParamAsOptNum', () => {
        it('should return null in case, passed value is undefined', () => {
          expect(parseJsonParamAsOptNum(undefined)).toBe(null);
        });

        it('should return passed value in case it is number', () => {
          expect(parseJsonParamAsOptNum(999)).toBe(999);
        });
      });

      describe('parseJsonParamAsString', () => {
        it('should throw an error in case, passed value is not string', () => {
          expect(() => parseJsonParamAsString(123)).toThrow();
        });

        it('should return passed value in case it is string', () => {
          expect(parseJsonParamAsString('abc')).toBe('abc');
        });
      });

      describe('parseJsonParamAsOptString', () => {
        it('should return undefined in case, passed value is undefined', () => {
          expect(parseJsonParamAsOptString(undefined)).toBe(undefined);
        });

        it('should return passed value in case it is string', () => {
          expect(parseJsonParamAsOptString('abc')).toBe('abc');
        });
      });

      describe('parseJsonParamAsBool', () => {
        it('should throw an error in case, passed value is not boolean', () => {
          expect(() => parseJsonParamAsBool(123)).toThrow();
        });

        it('should return passed value in case it is boolean', () => {
          expect(parseJsonParamAsBool(true)).toBe(true);
        });
      });

      describe('parseJsonParamAsOptBool', () => {
        it('should return undefined in case, passed value is undefined', () => {
          expect(parseJsonParamAsOptBool(undefined)).toBe(undefined);
        });

        it('should return passed value in case it is boolean', () => {
          expect(parseJsonParamAsOptBool(true)).toBe(true);
        });
      });

      describe('parseJsonParamAsOptRGB', () => {
        it('should return undefined in case, passed value is undefined', () => {
          expect(parseJsonParamAsOptRGB(undefined)).toBe(undefined);
        });

        it('should return passed value in case it is RGB color', () => {
          expect(parseJsonParamAsOptRGB('#abc')).toBe('#aabbcc');
          expect(parseJsonParamAsOptRGB('#abcdef')).toBe('#abcdef');
        });
      });
    });
  });
});