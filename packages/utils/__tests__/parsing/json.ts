import {describe, expect, it} from '@jest/globals';
import {
  parseJsonValueAsString,
  parseJsonValueAsBoolean,
  parseJsonValueAsNumber,
  parseJsonValueAsRgb, createJsonParser,
} from '../../src/parsing';

describe('parsing', () => {
  describe('json.ts', () => {
    describe('parseJsonValueAsString', () => {
      it('should return value in case, it has type string', () => {
        expect(parseJsonValueAsString('abc')).toBe('abc');
      });

      it('should throw an error in case, passed value is not of type string', () => {
        expect(() => parseJsonValueAsString(true)).toThrow();
        expect(() => parseJsonValueAsString({})).toThrow();
      });
    });

    describe('parseJsonValueAsBoolean', () => {
      it('should return value in case, it has type boolean', () => {
        expect(parseJsonValueAsBoolean(true)).toBe(true);
        expect(parseJsonValueAsBoolean(false)).toBe(false);
      });

      it('should throw an error in case, passed value is not of type boolean', () => {
        expect(() => parseJsonValueAsBoolean('true')).toThrow();
        expect(() => parseJsonValueAsBoolean({})).toThrow();
      });
    });

    describe('parseJsonValueAsNumber', () => {
      it('should return value in case, it has type number', () => {
        expect(parseJsonValueAsNumber(9992)).toBe(9992);
      });

      it('should throw an error in case, passed value is not of type number', () => {
        expect(() => parseJsonValueAsNumber(true)).toThrow();
        expect(() => parseJsonValueAsNumber({})).toThrow();
      });
    });

    describe('parseJsonValueAsRgb', () => {
      it('should return value in case, it has #RRGGBB format', () => {
        expect(parseJsonValueAsRgb('#992211')).toBe('#992211');
      });

      it('should throw an error in case, passed value is not of type string or does not have #RRGGBB format', () => {
        expect(() => parseJsonValueAsRgb(true)).toThrow();
        expect(() => parseJsonValueAsRgb('#22ffA')).toThrow();
      });
    });

    describe('createJsonParser', () => {
      describe('returned function', () => {
        it(
          'should throw an error in case, passed value is not JSON ' +
          'object or not JSON object converted to string', () => {
            const parser = createJsonParser({});
            expect(() => parser('')).toThrow('Value is not JSON object converted to string.');
            expect(() => parser(true)).toThrow('Value is not JSON object.');
            expect(() => parser('{}')).not.toThrow();
            expect(() => parser({})).not.toThrow();
          },
        );

        it(
          'should throw an error in case, passed value does not ' +
          'contain required field presented in schema', () => {
            const parser = createJsonParser({prop: 'string'});
            expect(() => parser({})).toThrowError('Unable to parse field "prop"');
          },
        );

        it(
          'should not throw an error in case, passed value ' +
          'does not contain optional field presented in schema', () => {
            const parser = createJsonParser({
              prop: {
                type: 'string',
                optional: true,
              },
            });
            expect(parser({})).toEqual({});
            expect(parser({prop: 'wow'})).toEqual({prop: 'wow'});
          },
        );

        it(
          'should throw an error in case, passed value contains ' +
          'field of different type presented in schema', () => {
            const parser = createJsonParser({prop: 'string'});
            expect(() => parser({prop: 123}))
              .toThrowError('Unable to parse field "prop"');
          },
        );

        it('should correctly parse built-in types', () => {
          const parser = createJsonParser({
            bool: 'boolean',
            string: 'string',
            number: 'number',
            rgb: 'rgb',
          });
          const obj = {
            bool: true,
            string: '123',
            number: 999,
            rgb: '#FFAACC',
          };
          expect(parser(obj)).toEqual(obj);
        });
      });
    });
  });
});