import { describe, expect, it } from '@jest/globals';
import { createSearchParamsParser } from '../../src';

describe('parsing', () => {
  describe('search-params.ts', () => {
    describe('createSearchParamsParser', () => {
      describe('function result', () => {
        it('should throw an error in case, passed value is not of type '
          + 'string or URLSearchParams', () => {
          const parser = createSearchParamsParser({});
          expect(() => parser(true)).toThrow();
          expect(() => parser({})).toThrow();
          expect(() => parser('true')).not.toThrow();
          expect(() => parser(new URLSearchParams())).not.toThrow();
        });

        it('should throw an error in case, passed value does not '
          + 'contain required field presented in schema', () => {
          const parser = createSearchParamsParser({ prop: 'string' });
          expect(() => parser('abc=123')).toThrowError('Unable to parse field "prop"');
        });

        it('should not throw an error in case, passed value '
          + 'does not contain optional field presented in schema', () => {
          const parser = createSearchParamsParser({
            prop: {
              type: 'string',
              optional: true,
            },
          });
          expect(parser('')).toEqual({});
          expect(parser('prop=abc')).toEqual({ prop: 'abc' });
        });

        it('should throw an error in case, passed value contains '
          + 'field of different type presented in schema', () => {
          const parser = createSearchParamsParser({ prop: 'date' });
          expect(() => parser('prop=abc'))
            .toThrowError('Unable to parse field "prop"');
        });

        it('should correctly parse built-in types', () => {
          const parser = createSearchParamsParser({
            date: 'date',
            string: 'string',
          });
          const params = new URLSearchParams();
          params.set('date', '66653332');
          params.set('string', 'some string');
          expect(parser(params)).toEqual({
            date: new Date(66653332000),
            string: 'some string',
          });
        });
      });
    });
  });
});
