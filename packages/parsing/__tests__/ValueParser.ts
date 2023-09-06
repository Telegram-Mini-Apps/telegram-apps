import { ValueParser } from '../src/index.js';

describe('ValueParser.ts', () => {
  describe('ValueParser', () => {
    describe('parse', () => {
      it('should return value from parser', () => {
        const parser = new ValueParser(() => 'my value');

        expect(parser.parse('abc')).toBe('my value');
      });

      it('should throw an error in case, wrapped parser was unable to parse value', () => {
        const parser = new ValueParser((v) => {
          if (v === 'throw') {
            throw new Error('I am throwing');
          }
          return true;
        });

        expect(() => parser.parse('throw')).toThrow('I am throwing');
      });
    });

    describe('optional', () => {
      it('should return undefined in case, passed value is undefined', () => {
        const parser = new ValueParser(() => 'does not matter').optional();

        expect(parser.parse(undefined)).toBe(undefined);
      });

      it('should return undefined in case, passed value satisfies passed isEmpty function', () => {
        const parser = new ValueParser(() => 'does not matter').optional(
          (v) => v === null || v === undefined,
        );

        expect(parser.parse(undefined)).toBe(undefined);
        expect(parser.parse(null)).toBe(undefined);
        expect(parser.parse('abc')).toBe('does not matter');
      });
    });

    describe('default', () => {
      it('should return undefined in case, passed value is undefined and default was not specified', () => {
        const parser = new ValueParser(() => 'does not matter').optional(
          (v) => v === null || v === undefined,
        );

        expect(parser.parse(undefined)).toBe(undefined);
        expect(parser.parse(null)).toBe(undefined);
        expect(parser.parse('abc')).toBe('does not matter');
      });

      it('should return value from passed default function in case value is empty', () => {
        const parser = new ValueParser(() => 'does not matter')
          .optional((v) => v === null || v === undefined)
          .default(() => 'my value');

        expect(parser.parse(undefined)).toBe('my value');
        expect(parser.parse(null)).toBe('my value');
        expect(parser.parse('abc')).toBe('does not matter');
      });
    });
  });
});
