import { expect, it } from 'vitest';

import { invoiceClosed } from '../invoiceClosed';

it('should return parsed value in case, passed value satisfies schema', () => {
  const value = { slug: 'abc', status: 'def' };
  expect(invoiceClosed().parse(value)).toStrictEqual(value);
});

it('should throw an error in case, passed value does not satisfy schema', () => {
  expect(() => invoiceClosed().parse({})).toThrow();
});
