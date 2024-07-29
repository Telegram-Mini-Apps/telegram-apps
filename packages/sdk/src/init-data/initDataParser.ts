import { json } from '@/parsing/parsers/json.js';
import { boolean } from '@/parsing/parsers/boolean.js';
import { string } from '@/parsing/parsers/string.js';
import { number } from '@/parsing/parsers/number.js';
import { searchParams } from '@/parsing/parsers/searchParams.js';
import { date } from '@/parsing/parsers/date.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { Chat, InitData, User } from './types.js';

export function initDataParser(): ValueParser<InitData, false> {
  const user = json<User>({
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
  }, 'User')
    .optional();

  return searchParams<InitData>({
    authDate: {
      type: date(),
      from: 'auth_date',
    },
    canSendAfter: {
      type: number().optional(),
      from: 'can_send_after',
    },
    chat: json<Chat>({
      id: number(),
      type: string(),
      title: string(),
      photoUrl: {
        type: string().optional(),
        from: 'photo_url',
      },
      username: string().optional(),
    }, 'Chat')
      .optional(),
    chatInstance: {
      type: string().optional(),
      from: 'chat_instance',
    },
    chatType: {
      type: string().optional(),
      from: 'chat_type',
    },
    hash: string(),
    queryId: {
      type: string().optional(),
      from: 'query_id',
    },
    receiver: user,
    startParam: {
      type: string().optional(),
      from: 'start_param',
    },
    user,
  }, 'InitData');
}