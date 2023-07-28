import {
  string,
  boolean,
  number,
  rgb, json,
} from '../../src';

describe('parsing', () => {
  describe('json.ts', () => {
    describe('parseJsonValueAsString', () => {
      it('should return value in case, it has type string', () => {
        expect(string('abc')).toBe('abc');
      });

      it('should throw an error in case, passed value is not of type string', () => {
        expect(() => string(true)).toThrow();
        expect(() => string({})).toThrow();
      });
    });

    describe('parseJsonValueAsBoolean', () => {
      it('should return value in case, it has type boolean', () => {
        expect(boolean(true)).toBe(true);
        expect(boolean(false)).toBe(false);
      });

      it('should throw an error in case, passed value is not of type boolean', () => {
        expect(() => boolean('true')).toThrow();
        expect(() => boolean({})).toThrow();
      });
    });

    describe('parseJsonValueAsNumber', () => {
      it('should return value in case, it has type number', () => {
        expect(number(9992)).toBe(9992);
      });

      it('should throw an error in case, passed value is not of type number', () => {
        expect(() => number(true)).toThrow();
        expect(() => number({})).toThrow();
      });
    });

    describe('parseJsonValueAsRgb', () => {
      it('should return value in case, it has #RRGGBB format', () => {
        expect(rgb('#992211')).toBe('#992211');
      });

      it('should throw an error in case, passed value is not of type string or does not have #RRGGBB format', () => {
        expect(() => rgb(true)).toThrow();
        expect(() => rgb('#22ffA')).toThrow();
      });
    });

    describe('createJsonParser', () => {
      describe('returned function', () => {
        it('should throw an error in case, passed value is not JSON '
          + 'object or not JSON object converted to string', () => {
          const parser = json({});
          expect(() => parser('')).toThrow('Value is not JSON object converted to string.');
          expect(() => parser(true)).toThrow('Value is not JSON object.');
          expect(() => parser('{}')).not.toThrow();
          expect(() => parser({})).not.toThrow();
        });

        it('should throw an error in case, passed value does not '
          + 'contain required field presented in schema', () => {
          const parser = json({ prop: 'string' });
          expect(() => parser({})).toThrowError('Unable to parse field "prop"');
        });

        it('should not throw an error in case, passed value '
          + 'does not contain optional field presented in schema', () => {
          const parser = json({
            prop: {
              type: 'string',
              optional: true,
            },
          });
          expect(parser({})).toEqual({});
          expect(parser({ prop: 'wow' })).toEqual({ prop: 'wow' });
        });

        it('should throw an error in case, passed value contains '
          + 'field of different type presented in schema', () => {
          const parser = json({ prop: 'string' });
          expect(() => parser({ prop: 123 }))
            .toThrowError('Unable to parse field "prop"');
        });

        it('should correctly parse built-in types', () => {
          const parser = json({
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
