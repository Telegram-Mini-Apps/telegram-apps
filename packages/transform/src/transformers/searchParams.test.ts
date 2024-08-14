import { expect, it } from 'vitest';

import { ERR_PARSE, ERR_UNEXPECTED_TYPE } from '../errors/errors.js';

import { date } from './date.js';
import { searchParams } from './searchParams.js';
import { string } from './string.js';

it('should throw an error in case, passed value is not of type string or URLSearchParams', () => {
  const parser = searchParams({})(true);
  expect(() => parser(true)).toThrow();
  expect(() => parser({})).toThrow();
  expect(() => parser('true')).not.toThrow();
  expect(() => parser(new URLSearchParams())).not.toThrow();
});

it('should throw an error in case, passed value does not contain required field presented in schema', () => {
  const parser = searchParams({ prop: string() })();

  try {
    parser('abc=123');
  } catch (e) {
    expect(e).toMatchObject({
      message: 'Unable to parse value',
      type: ERR_PARSE,
      cause: {
        type: ERR_PARSE,
        message: 'Unable to parse field "prop"',
        cause: {
          type: ERR_PARSE,
          message: 'Unable to parse value as string',
          cause: {
            type: ERR_UNEXPECTED_TYPE,
          },
        },
      },
    });
  }
  expect.assertions(1);
});

it('should not throw an error in case, passed value does not contain optional field presented in schema', () => {
  const parser = searchParams<{ prop?: string }>({
    prop: string(true),
  })();
  expect(parser('')).toEqual({});
  expect(parser('prop=abc')).toEqual({ prop: 'abc' });
});

it('should use parser with unspecified type', () => {
  const parser = searchParams<{ prop: unknown }>({
    prop: () => {
      throw new Error('Just an error');
    },
  })();

  try {
    parser('prop=');
  } catch (e) {
    expect(e).toMatchObject({
      message: 'Unable to parse value',
      cause: {
        message: 'Unable to parse field "prop"',
        cause: {
          message: 'Just an error',
        },
      },
    });
  }
  expect.assertions(1);
});

it('should throw an error in case, passed value contains field of different type presented in schema', () => {
  const parser = searchParams({ prop: date() })();

  try {
    parser('prop=abc');
  } catch (e) {
    expect(e).toMatchObject({
      type: ERR_PARSE,
      message: 'Unable to parse value',
      cause: {
        type: ERR_PARSE,
        message: 'Unable to parse field "prop"',
        cause: {
          type: ERR_PARSE,
          message: 'Unable to parse value as Date',
          cause: {
            type: ERR_PARSE,
            message: 'Unable to parse value as number',
            cause: {
              type: ERR_UNEXPECTED_TYPE,
            },
          },
        },
      },
    });
  }
  expect.assertions(1);
});

it('should correctly parse built-in types', () => {
  const parser = searchParams({
    date: date(),
    string: string(),
  })();
  const params = new URLSearchParams();
  params.set('date', '66653332');
  params.set('string', 'some string');
  expect(parser(params)).toEqual({
    date: new Date(66653332000),
    string: 'some string',
  });
});
