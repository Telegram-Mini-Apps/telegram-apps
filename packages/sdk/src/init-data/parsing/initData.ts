import { date } from '@/parsing/parsers/date.js';
import { number } from '@/parsing/parsers/number.js';
import { searchParams } from '@/parsing/parsers/searchParams.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import { chat } from './chat.js';
import { user } from './user.js';
import type { InitDataParsed } from '../types.js';

/**
 * Returns parser used to parse init data, presented as search params.
 */
export function initData(): ValueParser<InitDataParsed, false> {
  return searchParams<InitDataParsed>({
    authDate: {
      type: date(),
      from: 'auth_date',
    },
    canSendAfter: {
      type: number().optional(),
      from: 'can_send_after',
    },
    chat,
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
