import { describe, expect, it } from 'vitest';

import { boolean } from '../boolean';
import { json } from '../json';
import { number } from '../number';
import { string } from '../string';

it('should throw an error in case, passed value is not JSON object or not JSON object converted to string', () => {
  const parser = json({});
  expect(() => parser.parse('')).toThrow();
  expect(() => parser.parse(true)).toThrow();
  expect(() => parser.parse('{}')).not.toThrow();
  expect(() => parser.parse({})).not.toThrow();
});

it('should throw an error in case, passed value does not contain required field presented in schema', () => {
  const parser = json({ prop: string() });
  expect(() => parser.parse({})).toThrow();
});

it('should ignore field in case its value is undefined', () => {
  const parser = json<{ prop?: string }>({ prop: undefined });
  expect(parser.parse({})).toStrictEqual({});
});

describe('field definition as object', () => {
  it('should extract field value from the specified property "from"', () => {
    const parser = json({
      a: {
        type: (value) => value,
        from: 'b',
      },
    });
    expect(parser.parse({ b: 'Hello there!' })).toStrictEqual({ a: 'Hello there!' });
  });

  it('should extract field value from schema field name, if "from" was not specified', () => {
    const parser = json({
      a: {
        type: (value) => value,
      },
    });
    expect(parser.parse({ a: 'Hello there!' })).toStrictEqual({ a: 'Hello there!' });
  });

  it('should apply parser passed as ValueParser', () => {
    const parser = json({
      a: {
        type: string(),
      },
    });
    expect(parser.parse({ a: 'Hello there!' })).toStrictEqual({ a: 'Hello there!' });
  });
});

it('should also apply parser presented as function', () => {
  const parser = json({
    prop: () => 'static value',
  });
  expect(parser.parse({ prop: 999 })).toStrictEqual({ prop: 'static value' });
});

it('should throw an error in case, passed value contains field of different type presented in schema', () => {
  const parser = json({ prop: string() });
  expect(() => parser.parse({ prop: {} })).toThrow();
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
