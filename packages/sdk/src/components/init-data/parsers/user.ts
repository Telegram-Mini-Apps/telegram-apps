import { boolean } from '@/parsing/parsers/boolean.js';
import { json } from '@/parsing/parsers/json.js';
import { number } from '@/parsing/parsers/number.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';
import type { User } from '@/types.js';

/**
 * Returns parser used to parse user data.
 */
export function user(): ValueParser<User, false> {
  return json<User>({
    addedToAttachmentMenu: {
      type: boolean().optional(),
      from: 'added_to_attachment_menu',
    },
    allowsWriteToPm: {
      type: boolean().optional(),
      from: 'allows_write_to_pm',
    },
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
    languageCode: {
      type: string().optional(),
      from: 'language_code',
    },
    lastName: {
      type: string().optional(),
      from: 'last_name',
    },
    photoUrl: {
      type: string().optional(),
      from: 'photo_url',
    },
    username: string().optional(),
  }, 'User');
}
