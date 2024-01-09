import { expect, it } from 'vitest';

import { clipboardTextReceived } from '../clipboardTextReceived';

it('should return parsed value in case, passed value satisfies schema', () => {
  const cases = [
    { req_id: 'abc', data: 'ok' },
    { req_id: 'abc' },
    { req_id: 'abc', data: null },
  ];

  cases.forEach((value) => {
    expect(clipboardTextReceived().parse(value)).toStrictEqual(value);
    expect(clipboardTextReceived().parse(JSON.stringify(value)))
      .toStrictEqual(value);
  });
});

it('should throw an error in case, passed value does not satisfy schema', () => {
  expect(() => clipboardTextReceived().parse({})).toThrow();
});
