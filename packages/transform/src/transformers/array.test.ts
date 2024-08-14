import { describe, expect, it } from 'vitest';

import { array } from './array.js';
import { string } from './string.js';

const ofAny = (v: unknown) => v;

it('should return value in case, it is array', () => {
  expect(array(ofAny)()(['abc'])).toStrictEqual(['abc']);
});

it('should correctly parse JSON Array presented as string', () => {
  expect(array(ofAny)()('["abc"]')).toStrictEqual(['abc']);
});

it('should throw an error in case, passed value is not array', () => {
  expect(() => array(ofAny)()(true)).toThrow();
  expect(() => array(ofAny)()(1)).toThrow();
  expect(() => array(ofAny)()('okay')).toThrow();
  expect(() => array(ofAny)()({})).toThrow();
});

describe('of', () => {
  it('should correctly apply item parser to each array item', () => {
    expect(array(string())()(['abc'])).toStrictEqual(['abc']);
  });

  it('should throw an error in case, item parser was unable to parse value', () => {
    expect(() => array(string())()(['abc', {}])).toThrow();
  });

  it('should use parsing function directly if it is not ValueParser', () => {
    expect(array(() => 'Hello!')()(['abc'])).toStrictEqual(['Hello!']);
  });
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(array(ofAny)(true)(undefined)).toBe(undefined);
  });
});
