import {
  searchParams,
  json,
  string,
  number,
  boolean,
  date,
  type SchemaFieldDetailed,
  type ValueParser,
} from '@twa.js/parsing';

import type { InitData, User } from './types.js';

function field<T>(parser: ValueParser<T>, from?: string): SchemaFieldDetailed<T> {
  return {
    from,
    type: parser,
  };
}

const user = json<User>({
  firstName: field(string(), 'first_name'),
  id: number(),
  isBot: field(boolean().optional(), 'is_bot'),
  isPremium: field(boolean().optional(), 'is_premium'),
  lastName: field(string().optional(), 'last_name'),
  languageCode: field(string().optional(), 'language_code'),
  photoUrl: field(string().optional(), 'photo_url'),
  username: string().optional(),
});

/**
 * Parser used to parse init data, presented as search params.
 */
export const initData = searchParams<InitData>({
  authDate: field(date(), 'auth_date'),
  hash: string(),
  user: user.optional(),
  receiver: user.optional(),
  chat: json<InitData['chat']>({
    id: number(),
    type: string(),
    title: string(),
    photoUrl: field(string().optional(), 'photo_url'),
    username: string().optional(),
  }).optional(),
  canSendAfter: field(date().optional(), 'can_send_after'),
  queryId: field(string().optional(), 'query_id'),
  startParam: field(string().optional(), 'start_param'),
});
