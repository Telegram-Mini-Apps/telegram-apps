import { expect, it } from 'vitest';

import { ERR_PARSE, ERR_UNEXPECTED_TYPE } from '../errors/errors.js';

import { date } from './date.js';
import { searchParams } from './searchParams.js';
import { string } from './string.js';
import { TypedError } from '@telegram-apps/toolkit';

it('should throw if passed value is not of type string or URLSearchParams', () => {
  const parser = searchParams({})(true);
  expect(() => parser(true)).toThrow();
  expect(() => parser({})).toThrow();
  expect(() => parser('true')).not.toThrow();
  expect(() => parser(new URLSearchParams())).not.toThrow();
});

it('should throw if passed value does not contain required field presented in schema', () => {
  const parser = searchParams({ prop: string() })();

  expect(() => parser('abc=123')).toThrow(
    new TypedError(ERR_PARSE, '"searchParams" transformer failed to parse the value',
      new TypedError(ERR_PARSE, 'Parser for "prop" failed',
        new TypedError(ERR_PARSE, 'Unable to parse value as string',
          new TypedError(ERR_UNEXPECTED_TYPE),
        ),
      ),
    ),
  );
});

it('should not throw if passed value does not contain optional field presented in schema', () => {
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

  expect(() => parser('prop=')).toThrow(
    new TypedError(ERR_PARSE, '"searchParams" transformer failed to parse the value',
      new TypedError(ERR_PARSE, 'Parser for "prop" failed',
        new Error('Just an error'),
      ),
    ),
  );
});

it('should throw if passed value contains field of different type presented in schema', () => {
  const parser = searchParams({ prop: date() })();

  expect(() => parser('prop=abc')).toThrow(
    new TypedError(ERR_PARSE, '"searchParams" transformer failed to parse the value',
      new TypedError(ERR_PARSE, 'Parser for "prop" failed',
        new TypedError(ERR_PARSE, 'Unable to parse value as Date',
          new TypedError(ERR_PARSE, 'Unable to parse value as number',
            new TypedError(ERR_UNEXPECTED_TYPE),
          ),
        ),
      ),
    ),
  );
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
