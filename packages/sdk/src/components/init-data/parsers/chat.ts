import { json } from '@/parsing/parsers/json.js';
import { number } from '@/parsing/parsers/number.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';
import type { Chat } from '@/types.js';

/**
 * Returns parser used to parse chat data.
 */
export function chat(): ValueParser<Chat, false> {
  return json<Chat>({
    id: number(),
    type: string(),
    title: string(),
    photoUrl: {
      type: string().optional(),
      from: 'photo_url',
    },
    username: string().optional(),
  }, 'Chat');
}
