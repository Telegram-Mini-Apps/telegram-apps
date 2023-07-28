import { searchParams, json } from '@twa.js/utils';

import type { InitData } from './types.js';

const user = json({
  firstName: { type: 'string', from: 'first_name' },
  id: 'number',
  isBot: { type: 'boolean', from: 'is_bot', optional: true },
  isPremium: { type: 'boolean', from: 'is_premium', optional: true },
  lastName: { type: 'string', from: 'last_name', optional: true },
  languageCode: { type: 'string', from: 'language_code', optional: true },
  photoUrl: { type: 'string', from: 'photo_url', optional: true },
  username: { type: 'string', optional: true },
});

const initDataSearchParams = searchParams({
  authDate: { type: 'date', from: 'auth_date' },
  hash: 'string',
  user: { type: user, optional: true },
  receiver: { type: user, optional: true },
  chat: {
    type: json({
      id: 'number',
      type: 'string',
      title: 'string',
      photoUrl: { type: 'string', from: 'photo_url', optional: true },
      username: { type: 'string', optional: true },
    }),
    optional: true,
  },
  canSendAfter: { type: 'date', from: 'can_send_after', optional: true },
  queryId: { type: 'string', from: 'query_id', optional: true },
  startParam: { type: 'string', from: 'start_param', optional: true },
});

/**
 * Extracts init data from search params presented as a string.
 * @param sp - query parameters.
 */
export function initData(sp: string | URLSearchParams): InitData {
  return initDataSearchParams(sp);
}
