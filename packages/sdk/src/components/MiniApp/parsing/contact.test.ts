import { toSearchParams } from 'test-utils';
import { expect, it } from 'vitest';

import { contact } from './contact.js';

it('should return parsed value in case, passed value satisfies schema', () => {
  expect(
    contact().parse(toSearchParams({
      contact: {
        user_id: 123,
        phone_number: '+79292',
        first_name: 'Wolfram',
        last_name: 'Deus',
      },
      auth_date: 1000,
      hash: 'my-hash',
    })),
).toMatchObject({
    contact: {
      userId: 123,
      phoneNumber: '+79292',
      firstName: 'Wolfram',
      lastName: 'Deus',
    },
    authDate: new Date(1000000),
    hash: 'my-hash',
  });
});

it('should throw an error in case, passed value does not satisfy schema', () => {
  expect(() => contact().parse({})).toThrow();
});
