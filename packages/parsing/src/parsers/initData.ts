import type { Chat, InitData, User } from '@telegram-apps/types';

import type { ValueParser } from '@/ValueParser/ValueParser.js';
import { json } from './json.js';
import { boolean } from './boolean.js';
import { string } from './string.js';
import { number } from './number.js';
import { date } from './date.js';
import { searchParams } from './searchParams.js';

export type { InitData };

export function initData(): ValueParser<InitData, false> {
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