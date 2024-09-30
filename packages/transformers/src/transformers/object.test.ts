import { describe, expect, it } from 'vitest';

import { boolean } from './boolean.js';
import { object } from './object.js';
import { number } from './number.js';
import { string } from './string.js';

it('should throw an error in case, passed value is not JSON object or not JSON object converted to string', () => {
  const parser = object({})();
  expect(() => parser('')).toThrow();
  expect(() => parser(true)).toThrow();
  expect(() => parser('{}')).not.toThrow();
  expect(() => parser({})).not.toThrow();
});

it('should throw an error in case, passed value does not contain required field presented in schema', () => {
  const parser = object({ prop: string() })();
  expect(() => parser({})).toThrow();
});

it('should ignore field in case its value is undefined', () => {
  const parser = object<{ prop?: string }>({ prop: undefined })();
  expect(parser({})).toStrictEqual({});
});

describe('field definition as object', () => {
  it('should extract field value from the specified property "from"', () => {
    const parser = object({
      a: ['b', (value) => value],
    })();
    expect(parser({ b: 'Hello there!' })).toStrictEqual({ a: 'Hello there!' });
  });
});

it('should also apply parser presented as function', () => {
  const parser = object({
    prop: () => 'static value',
  })();
  expect(parser({ prop: 999 })).toStrictEqual({ prop: 'static value' });
});

it('should throw an error in case, passed value contains field of different type presented in schema', () => {
  const parser = object({ prop: string() })();
  expect(() => parser({ prop: {} })).toThrow();
});

it('should correctly parse built-in types', () => {
  const parser = object({
    bool: boolean(),
    string: string(),
    number: number(),
  })();
  const obj = {
    bool: true,
    string: '123',
    number: 999,
  };
  expect(parser(obj)).toStrictEqual(obj);
});
