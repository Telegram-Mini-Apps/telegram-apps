import { describe, expect, it } from 'vitest';

import { array, string } from '~/parsing/index.js';

it('should return value in case, it is array', () => {
  expect(array().parse(['abc'])).toStrictEqual(['abc']);
});

it('should correctly parse JSON Array presented as string', () => {
  expect(array().parse('["abc"]')).toStrictEqual(['abc']);
});

it('should throw an error in case, passed value is not array', () => {
  expect(() => array().parse(true)).toThrow();
  expect(() => array().parse(1)).toThrow();
  expect(() => array().parse('okay')).toThrow();
  expect(() => array().parse({})).toThrow();
});

describe('of', () => {
  it('should correctly apply item parser to each array item', () => {
    expect(array().of(string()).parse(['abc'])).toStrictEqual(['abc']);
  });

  it('should throw an error in case, item parser was unable to parse value', () => {
    expect(() => array().of(string()).parse(['abc', {}])).toThrow();
  });

  it('should use parsing function directly if it is not ValueParser', () => {
    expect(array().of(() => 'Hello!').parse(['abc'])).toStrictEqual(['Hello!']);
  });
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(array().optional().parse(undefined)).toBe(undefined);
  });
});
