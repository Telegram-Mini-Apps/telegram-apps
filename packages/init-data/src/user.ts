import { json, string, boolean, number } from '@tma.js/parsing';

import type { User } from './types.js';

/**
 * Returns parser used to parse user data.
 */
export function user() {
  return json<User>({
    firstName: {
      type: string(),
      from: 'first_name',
    },
    id: number(),
    isBot: {
      type: boolean().optional(),
      from: 'is_bot',
    },
    isPremium: {
      type: boolean().optional(),
      from: 'is_premium',
    },
    lastName: {
      type: string().optional(),
      from: 'last_name',
    },
    languageCode: {
      type: string().optional(),
      from: 'language_code',
    },
    photoUrl: {
      type: string().optional(),
      from: 'photo_url',
    },
    username: string().optional(),
  });
}
