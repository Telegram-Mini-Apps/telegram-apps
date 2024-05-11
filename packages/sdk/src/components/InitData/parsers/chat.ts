import { json } from '@/parsing/parsers/json.js';
import { number } from '@/parsing/parsers/number.js';
import { string } from '@/parsing/parsers/string.js';

import type { Chat } from '../types.js';

export const chat = json<Chat>({
  id: number(),
  type: string(),
  title: string(),
  photoUrl: {
    type: string().optional(),
    from: 'photo_url',
  },
  username: string().optional(),
}, 'Chat')
  .optional();
