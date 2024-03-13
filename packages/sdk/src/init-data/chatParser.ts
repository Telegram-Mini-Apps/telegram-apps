import type { Chat } from './types.js';
import type { ValueParser } from '../parsing/index.js';
import { json, number, string } from '../parsing/index.js';

/**
 * Returns parser used to parse chat data.
 */
export function chatParser(): ValueParser<Chat, false> {
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
