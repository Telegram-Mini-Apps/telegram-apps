import { date, json, number, searchParams, string } from '~/parsing/index.js';

import type { RequestedContact } from './types.js';

export const contactParser = searchParams<RequestedContact>({
  contact: json({
    userId: {
      type: number(),
      from: 'user_id',
    },
    phoneNumber: {
      type: string(),
      from: 'phone_number',
    },
    firstName: {
      type: string(),
      from: 'first_name',
    },
    lastName: {
      type: string().optional(),
      from: 'last_name',
    },
  }),
  authDate: {
    type: date(),
    from: 'auth_date',
  },
  hash: string(),
});
