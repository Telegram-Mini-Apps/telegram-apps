import { array, boolean, date, json, number, rgb, searchParams, string } from '../src/index.js';

describe('parsers.ts', () => {
  describe('string', () => {
    describe('optional', () => {
      it('should return undefined if value is undefined', () => {
        expect(string().optional().parse(undefined)).toBe(undefined);
      });

      it('should return undefined is passed isEmpty function returned true', () => {
        expect(string().optional((value) => value === null).parse(null)).toBe(undefined);
      });
    });

    describe('required', () => {
      it('should return value in case, it has type string', () => {
        expect(string().parse('abc')).toBe('abc');
      });

      it('should throw an error in case, passed value is not of type string', () => {
        expect(() => string().parse(true)).toThrow();
        expect(() => string().parse({})).toThrow();
      });
    });
  });

  describe('rgb', () => {
    describe('optional', () => {
      it('should return undefined if value is undefined', () => {
        expect(rgb().optional().parse(undefined)).toBe(undefined);
      });

      it('should return undefined is passed isEmpty function returned true', () => {
        expect(rgb().optional((value) => value === null).parse(null)).toBe(undefined);
      });
    });

    describe('required', () => {
      it('should return value in case, it represents RGB color', () => {
        expect(rgb().parse('#fff')).toBe('#ffffff');
      });

      it('should throw an error in case, passed value is not of type string', () => {
        expect(() => rgb().parse(true)).toThrow();
        expect(() => rgb().parse({})).toThrow();
      });

      it('should throw an error in case, passed value does not represent RGB string', () => {
        expect(() => rgb().parse('my custom string')).toThrow();
      });
    });
  });

  describe('boolean', () => {
    describe('optional', () => {
      it('should return undefined if value is undefined', () => {
        expect(boolean().optional().parse(undefined)).toBe(undefined);
      });

      it('should return undefined is passed isEmpty function returned true', () => {
        expect(boolean().optional((value) => value === null).parse(null)).toBe(undefined);
      });
    });

    describe('required', () => {
      it('should return value in case, it has type boolean', () => {
        expect(boolean().parse(true)).toBe(true);
        expect(boolean().parse(false)).toBe(false);
      });

      it('should throw an error in case, passed value is not of type boolean', () => {
        expect(() => boolean().parse('true')).toThrow();
        expect(() => boolean().parse({})).toThrow();
      });
    });
  });

  describe('number', () => {
    describe('optional', () => {
      it('should return undefined if value is undefined', () => {
        expect(number().optional().parse(undefined)).toBe(undefined);
      });

      it('should return undefined is passed isEmpty function returned true', () => {
        expect(number().optional((value) => value === null).parse(null)).toBe(undefined);
      });
    });

    describe('required', () => {
      it('should return value in case, it has type number', () => {
        expect(number().parse(9992)).toBe(9992);
      });

      it('should throw an error in case, passed value is not of type number', () => {
        expect(() => number().parse(true)).toThrow();
        expect(() => number().parse({})).toThrow();
      });
    });
  });

  describe('json', () => {
    it('should throw an error in case, passed value is not JSON object or not JSON object converted to string', () => {
      const parser = json({});
      expect(() => parser.parse('')).toThrow('Value is not JSON object converted to string.');
      expect(() => parser.parse(true)).toThrow('Value is not JSON object.');
      expect(() => parser.parse('{}')).not.toThrow();
      expect(() => parser.parse({})).not.toThrow();
    });

    it('should throw an error in case, passed value does not contain required field presented in schema', () => {
      const parser = json({ prop: string() });
      expect(() => parser.parse({})).toThrowError('Unable to parse field "prop"');
    });

    it('should ignore field in case its value is undefined', () => {
      const parser = json<{ prop?: string }>({ prop: undefined });
      expect(parser.parse({})).toStrictEqual({});
    });

    it('should properly process detailed field options', () => {
      const parser = json<{ a: undefined, b?: undefined; c: string }>({
        a: {
          type: () => undefined,
          required: true,
        },
        b: {
          type: () => undefined,
        },
        c: {
          type: string(),
        },
      });
      expect(parser.parse({
        a: undefined,
        b: undefined,
        c: 'Hello!',
      })).toStrictEqual({ a: undefined, c: 'Hello!' });
    });

    it('should correctly work with custom parser', () => {
      const parser = json({
        prop: () => 'value',
      });
      expect(parser.parse({ prop: 999 })).toStrictEqual({ prop: 'value' });
    });

    it('should throw an error in case, passed value contains field of different type presented in schema', () => {
      const parser = json({ prop: string() });
      expect(() => parser.parse({ prop: 123 })).toThrowError('Unable to parse field "prop"');
    });

    it('should correctly parse built-in types', () => {
      const parser = json({
        bool: boolean(),
        string: string(),
        number: number(),
      });
      const obj = {
        bool: true,
        string: '123',
        number: 999,
      };
      expect(parser.parse(obj)).toStrictEqual(obj);
    });
  });

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

  describe('array', () => {
    describe('of', () => {
      it('should correctly apply item parser', () => {
        expect(array().of(string()).parse(['abc'])).toStrictEqual(['abc']);
      });

      it('should throw an error in case, item parser was unable to parse value', () => {
        expect(() => array().of(string()).parse(['abc', 123])).toThrow();
      });
    });

    describe('optional', () => {
      it('should return undefined if value is undefined', () => {
        expect(array().optional().parse(undefined)).toBe(undefined);
      });

      it('should return undefined is passed isEmpty function returned true', () => {
        expect(array().optional((value) => value === null).parse(null)).toBe(undefined);
      });
    });

    describe('required', () => {
      it('should return value in case, it is array', () => {
        expect(array().parse(['abc'])).toStrictEqual(['abc']);
      });

      it('should throw an error in case, passed value is not array', () => {
        expect(() => array().parse(true)).toThrow();
        expect(() => array().parse({})).toThrow();
      });
    });
  });
});
