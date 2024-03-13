import { chatParser } from './chatParser.js';
import type { InitDataParsed } from './types.js';
import { userParser } from './userParser.js';
import { date, number, searchParams, string, type ValueParser } from '../parsing/index.js';

/**
 * Returns parser used to parse init data, presented as search params.
 */
export function initDataParser(): ValueParser<InitDataParsed, false> {
  return searchParams<InitDataParsed>({
    authDate: {
      type: date(),
      from: 'auth_date',
    },
    canSendAfter: {
      type: number().optional(),
      from: 'can_send_after',
    },
    chat: chatParser().optional(),
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
    receiver: userParser().optional(),
    startParam: {
      type: string().optional(),
      from: 'start_param',
    },
    user: userParser().optional(),
  }, 'InitData');
}
