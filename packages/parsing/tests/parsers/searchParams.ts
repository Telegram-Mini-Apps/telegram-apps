import { describe, expect, it } from 'vitest';
import { date, searchParams, string } from '../../src/index.js';

describe('parsers', () => {
  describe('searchParams.ts', () => {
    describe('searchParams', () => {
      it('should throw an error in case, passed value is not of type string or URLSearchParams', () => {
        const parser = searchParams({});
        expect(() => parser.parse(true)).toThrow();
        expect(() => parser.parse({})).toThrow();
        expect(() => parser.parse('true')).not.toThrow();
        expect(() => parser.parse(new URLSearchParams())).not.toThrow();
      });

      it('should throw an error in case, passed value does not contain required field presented in schema', () => {
        const parser = searchParams({ prop: string() });
        expect(() => parser.parse('abc=123')).toThrowError('Unable to parse field "prop"');
      });

      it('should not throw an error in case, passed value does not contain optional field presented in schema', () => {
        const parser = searchParams<{ prop?: string }>({
          prop: string().optional(),
        });
        expect(parser.parse('')).toEqual({});
        expect(parser.parse('prop=abc')).toEqual({ prop: 'abc' });
      });

      it('should throw an error in case, passed value contains field of different type presented in schema', () => {
        const parser = searchParams({ prop: date() });
        expect(() => parser.parse('prop=abc')).toThrowError('Unable to parse field "prop"');
      });

      it('should correctly parse built-in types', () => {
        const parser = searchParams({
          date: date(),
          string: string(),
        });
        const params = new URLSearchParams();
        params.set('date', '66653332');
        params.set('string', 'some string');
        expect(parser.parse(params)).toEqual({
          date: new Date(66653332000),
          string: 'some string',
        });
      });
    });
  });
});
