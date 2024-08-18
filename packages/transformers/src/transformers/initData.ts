import type { Chat, InitData, User } from '@telegram-apps/types';

import { object } from './object.js';
import { boolean } from './boolean.js';
import { string } from './string.js';
import { number } from './number.js';
import { date } from './date.js';
import { searchParams } from './searchParams.js';
import { createTransformerGen } from './createTransformerGen.js';

export const initData = createTransformerGen<InitData>(value => {
  const user = object<User>({
    addedToAttachmentMenu: ['added_to_attachment_menu', boolean(true)],
    allowsWriteToPm: ['allows_write_to_pm', boolean(true)],
    firstName: ['first_name', string()],
    id: number(),
    isBot: ['is_bot', boolean(true)],
    isPremium: ['is_premium', boolean(true)],
    languageCode: ['language_code', string(true)],
    lastName: ['last_name', string(true)],
    photoUrl: ['photo_url', string(true)],
    username: string(true),
  }, 'User')(true);

  return searchParams<InitData>({
    authDate: ['auth_date', date()],
    canSendAfter: ['can_send_after', number(true)],
    chat: object<Chat>({
        id: number(),
        type: string(),
        title: string(),
        photoUrl: ['photo_url', string(true)],
        username: string(true),
      },
      'Chat',
    )(true),
    chatInstance: ['chat_instance', string(true)],
    chatType: ['chat_type', string(true)],
    hash: string(),
    queryId: ['query_id', string(true)],
    receiver: user,
    startParam: ['start_param', string(true)],
    user,
  }, 'InitData')()(value);
});

export type { InitData };
