import { expect, test } from 'vitest';

import { ValueParser } from '../src/index.js';

test('ValueParser.ts', () => {
  test('ValueParser', () => {
    test('parse', () => {
     test('should return value from parser', () => {
        const parser = ValueParser.create(() => 'my value');

        expect(parser.parse('abc')).toBe('my value');
      });

     test('should throw an error in case, wrapped parser was unable to parse value', () => {
        const parser = ValueParser.create((v) => {
          if (v === 'throw') {
            throw new Error('I am throwing');
          }
          return true;
        });

        expect(() => parser.parse('throw')).toThrow('I am throwing');
      });
    });

    test('optional', () => {
     test('should return undefined in case, passed value is undefined', () => {
        const parser = ValueParser.create(() => 'does not matter').optional();

        expect(parser.parse(undefined)).toBe(undefined);
      });

     test('should return undefined in case, passed value satisfies passed isEmpty function', () => {
        const parser = ValueParser.create(() => 'does not matter').optional(
          (v) => v === null || v === undefined,
        );

        expect(parser.parse(undefined)).toBe(undefined);
        expect(parser.parse(null)).toBe(undefined);
        expect(parser.parse('abc')).toBe('does not matter');
      });
    });

    test('default', () => {
     test('should return undefined in case, passed value is undefined and default was not specified', () => {
        const parser = ValueParser.create(() => 'does not matter').optional(
          (v) => v === null || v === undefined,
        );

        expect(parser.parse(undefined)).toBe(undefined);
        expect(parser.parse(null)).toBe(undefined);
        expect(parser.parse('abc')).toBe('does not matter');
      });

     test('should return value from passed default function in case value is empty', () => {
        const parser = ValueParser.create(() => 'does not matter')
          .optional((v) => v === null || v === undefined)
          .default(() => 'my value');

        expect(parser.parse(undefined)).toBe('my value');
        expect(parser.parse(null)).toBe('my value');
        expect(parser.parse('abc')).toBe('does not matter');
      });
    });
  });
});
