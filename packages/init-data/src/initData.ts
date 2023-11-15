import { string, number, date, searchParams } from '@tma.js/parsing';

import { user } from './user.js';
import { chat } from './chat.js';
import type { InitData } from './types.js';

/**
 * Returns parser used to parse init data, presented as search params.
 */
export function initData() {
  return searchParams<InitData>({
    authDate: {
      type: date(),
      from: 'auth_date',
    },
    canSendAfter: {
      type: number().optional(),
      from: 'can_send_after',
    },
    chat: chat().optional(),
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
    receiver: user().optional(),
    startParam: {
      type: string().optional(),
      from: 'start_param',
    },
    user: user().optional(),
  }, 'InitData');
}
