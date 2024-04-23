import { expect, it } from 'vitest';

import { phoneRequested } from '../parsers/phoneRequested.js';

it('should return parsed value in case, passed value satisfies schema', () => {
  const cases = [{ status: 'sent' }];

  cases.forEach((value) => {
    expect(phoneRequested().parse(value)).toStrictEqual(value);
    expect(phoneRequested().parse(JSON.stringify(value)))
      .toStrictEqual(value);
  });
});

it('should throw an error in case, passed value does not satisfy schema', () => {
  expect(() => phoneRequested().parse({})).toThrow();
});
