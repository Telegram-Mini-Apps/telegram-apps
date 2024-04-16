import { expect, it } from 'vitest';

import { writeAccessRequested } from './writeAccessRequested.js';

it('should return parsed value in case, passed value satisfies schema', () => {
  const cases = [{ status: 'sent' }];

  cases.forEach((value) => {
    expect(writeAccessRequested().parse(value)).toStrictEqual(value);
    expect(writeAccessRequested().parse(JSON.stringify(value)))
      .toStrictEqual(value);
  });
});

it('should throw an error in case, passed value does not satisfy schema', () => {
  expect(() => writeAccessRequested().parse({})).toThrow();
});
