import { json, number, string } from '~/parsing/index.js';

import type { Chat } from './types.js';

/**
 * Returns parser used to parse chat data.
 */
export function chatParser() {
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
