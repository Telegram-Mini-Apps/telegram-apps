import { expect, it } from 'vitest';

import { customMethodInvoked } from '../parsers/customMethodInvoked.js';

it('should return parsed value in case, passed value satisfies schema', () => {
  const cases = [
    { req_id: 'abc', result: 'ok' },
    { req_id: 'abc', result: 'not sure if ok', error: 'ERROR' },
    { req_id: 'abc' },
    { req_id: 'abc', error: 'ERROR' },
  ];

  cases.forEach((value) => {
    expect(customMethodInvoked().parse(value)).toStrictEqual(value);
    expect(customMethodInvoked().parse(JSON.stringify(value)))
      .toStrictEqual(value);
  });
});

it('should throw an error in case, passed value does not satisfy schema', () => {
  expect(() => customMethodInvoked().parse({})).toThrow();
});
