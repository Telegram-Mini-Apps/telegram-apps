import {describe, expect, it} from '@jest/globals';
import {
  parseSearchParamAsDate, parseSearchParamAsOptDate,
  parseSearchParamAsOptString,
  parseSearchParamAsString,
} from './parsers';

describe('parsing', () => {
  describe('search-params', () => {
    describe('parsers', () => {
      describe('parseSearchParamAsString', () => {
        it('should throw an error in case passed value is null', () => {
          expect(() => parseSearchParamAsString(null)).toThrow();
        });

        it('should return passed value in case it is string', () => {
          expect(parseSearchParamAsString('Hey')).toBe('Hey');
        });
      });

      describe('parseSearchParamAsOptString', () => {
        it('should return undefined in case passed value is null', () => {
          expect(parseSearchParamAsOptString(null)).toBe(undefined);
        });

        it('should return passed value in case it is string', () => {
          expect(parseSearchParamAsOptString('Hey')).toBe('Hey');
        });
      });

      describe('parseSearchParamAsDate', () => {
        it('should throw an error in case passed value is null or empty string', () => {
          expect(() => parseSearchParamAsDate(null)).toThrow();
          expect(() => parseSearchParamAsDate('')).toThrow();
        });

        it('should throw an error in case passed value is non-usable Date string', () => {
          expect(() => parseSearchParamAsDate('2022-11-03T10:29:01.572Z_HEY')).toThrow();
        });

        it('should return passed value in case it is usable Date string or number', () => {
          const str = '2022-11-03T10:29:01.572Z';
          expect(parseSearchParamAsDate(str)).toStrictEqual(new Date(str));
          expect(parseSearchParamAsDate('123')).toStrictEqual(new Date(123000));
        });
      });

      describe('parseSearchParamAsOptDate', () => {
        it('should return undefined in case passed value is null', () => {
          expect(parseSearchParamAsOptDate(null)).toBe(undefined);
        });

        it('should return passed value in case it is usable Date string or number', () => {
          const str = '2022-11-03T10:29:01.572Z';
          expect(parseSearchParamAsOptDate(str)).toStrictEqual(new Date(str));
          expect(parseSearchParamAsOptDate('123')).toStrictEqual(new Date(123000));
        });
      });
    });
  });
});