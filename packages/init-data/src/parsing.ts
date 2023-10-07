import {
  searchParams,
  json,
  string,
  number,
  boolean,
  date,
  type AnyParser,
} from '@tma.js/parsing';

import type { InitData, User } from './types.js';

function field<P extends AnyParser<any>>(parser: P, from?: string) {
  return {
    from,
    type: parser,
  };
}

const str = string();
const strOptional = string().optional();
const num = number();
const numOptional = number().optional();
const boolOptional = boolean().optional();

function user() {
  return json<User>({
    firstName: field(str, 'first_name'),
    id: num,
    isBot: field(boolOptional, 'is_bot'),
    isPremium: field(boolOptional, 'is_premium'),
    lastName: field(strOptional, 'last_name'),
    languageCode: field(strOptional, 'language_code'),
    photoUrl: field(strOptional, 'photo_url'),
    username: strOptional,
  });
}

function chat() {
  return json({
    id: num,
    type: str,
    title: str,
    photoUrl: field(strOptional, 'photo_url'),
    username: strOptional,
  });
}

/**
 * Parser used to parse init data, presented as search params.
 * @deprecated Use `parse` method instead.
 */
export const initData = searchParams<InitData>({
  authDate: field(date(), 'auth_date'),
  hash: str,
  user: user().optional(),
  receiver: user().optional(),
  chat: chat().optional(),
  chatType: field(strOptional, 'chat_type'),
  chatInstance: field(strOptional, 'chat_instance'),
  canSendAfter: field(numOptional, 'can_send_after'),
  queryId: field(strOptional, 'query_id'),
  startParam: field(strOptional, 'start_param'),
});

/**
 * Parses incoming value as init data.
 * @param value - value to parse.
 */
export function parse(value: string | URLSearchParams): InitData {
  return initData.parse(value);
}
