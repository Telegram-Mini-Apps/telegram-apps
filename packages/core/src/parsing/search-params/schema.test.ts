import {describe, it, expect, jest} from '@jest/globals';
import {createSearchParamsStructParser} from './schema';

const parser = createSearchParamsStructParser({
  hey: ['ho', v => v],
  listen: ['body', v => {
    if (v === null) {
      throw new Error('Invalid');
    }
    return v;
  }]
});

describe('parsing', () => {
  describe('search-params', () => {
    describe('schema', () => {
      it('should throw an error in case, value is null or undefined and getDefault not passed', () => {
        expect(() => parser(null)).toThrow('Value is empty.');
        expect(() => parser(undefined)).toThrow('Value is empty.');
      });

      it('should return getDefault value in case, passed value is null or undefined', () => {
        const fn = jest.fn(() => ({a: true}));
        const parser = createSearchParamsStructParser({}, fn);

        expect(parser(null)).toStrictEqual({a: true});
        expect(fn).toBeCalled();
      });

      it('should throw an error in case, passed value is not of type string and URLSearchParams', () => {
        expect(() => parser(123)).toThrow('Value has unexpected type.')
        expect(() => parser([])).toThrow('Value has unexpected type.')
        expect(() => parser(true)).toThrow('Value has unexpected type.')
        expect(() => parser('ho=&body=')).not.toThrow();
        expect(() => parser(new URLSearchParams('ho=&body='))).not.toThrow();
      });

      it('should throw an error in case, passed value contains incorrect property for parsing', () => {
        expect(() => parser('ho=')).toThrowError(/^Unable to parse parameter/);
      });
    });
  });
});