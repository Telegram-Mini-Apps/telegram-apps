import {describe, it, expect, jest} from '@jest/globals';
import {createJsonStructParser} from './schema';

const parser = createJsonStructParser({
  hey: ['ho', v => v],
  listen: ['body', v => {
    if (v === null || v === undefined) {
      throw new Error('Invalid');
    }
    return v;
  }],
});

describe('parsing', () => {
  describe('json', () => {
    describe('schema', () => {
      it('should throw an error in case, value is null or undefined and getDefault not passed', () => {
        expect(() => parser(null)).toThrow('Value is empty.');
        expect(() => parser(undefined)).toThrow('Value is empty.');
      });

      it('should return getDefault value in case, passed value is null or undefined', () => {
        const fn = jest.fn(() => ({a: true}));
        const parser = createJsonStructParser({}, fn);

        expect(parser(null)).toStrictEqual({a: true});
        expect(fn).toBeCalled();
      });

      it(
        'should throw an error in case, passed value is not ' +
        'JSON object or its string representation',
        () => {
          expect(() => parser(123)).toThrow('Value is not JSON object.');
          expect(() => parser([])).toThrow('Value is not JSON object.');
          expect(() => parser(true)).toThrow('Value is not JSON object.');
          expect(() => parser('{"ho":true,"body":1}')).not.toThrow();
          expect(() => parser({go: true, body: 1})).not.toThrow();
        }
        );

      it('should throw an error in case, invalid string representation of JSON object is passed', () => {
        expect(() => parser('{"ho":true,"body":1')).toThrow();
      });

      it('should throw an error in case, passed value contains incorrect property for parsing', () => {
        expect(() => parser('{"ho":true}')).toThrowError(/^Unable to parse parameter/);
      });
    });
  });
});