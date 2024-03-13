import type { RequestedContact } from './types.js';
import { date } from '../../parsing/parsers/date.js';
import { json } from '../../parsing/parsers/json.js';
import { number } from '../../parsing/parsers/number.js';
import { searchParams } from '../../parsing/parsers/searchParams.js';
import { string } from '../../parsing/parsers/string.js';

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
