import {Chat, InitData, User} from './types';
import {
  createJsonStructParser, createSearchParamsStructParser,
  parseJsonParamAsNum,
  parseJsonParamAsOptBool, parseJsonParamAsOptString,
  parseJsonParamAsString,
  parseSearchParamAsDate,
  parseSearchParamAsOptDate,
  parseSearchParamAsOptString,
  parseSearchParamAsString,
} from 'twa-core';

/**
 * Parses value as User.
 * @see createJsonStructParser
 */
const parseUser = createJsonStructParser<User, undefined>({
  id: ['id', parseJsonParamAsNum],
  isBot: ['is_bot', parseJsonParamAsOptBool],
  firstName: ['first_name', parseJsonParamAsString],
  lastName: ['last_name', parseJsonParamAsOptString],
  username: ['username', parseJsonParamAsOptString],
  languageCode: ['language_code', parseJsonParamAsOptString],
  isPremium: ['is_premium', parseJsonParamAsOptBool],
  photoUrl: ['photo_url', parseJsonParamAsOptString],
}, () => undefined);

/**
 * Parses value as Chat.
 * @see createJsonStructParser
 */
const parseChat = createJsonStructParser<Chat, undefined>({
  id: ['id', parseJsonParamAsNum],
  title: ['title', parseJsonParamAsString],
  type: ['type', parseJsonParamAsString],
  username: ['username', parseJsonParamAsOptString],
  photoUrl: ['photo_url', parseJsonParamAsOptString],
}, () => undefined);

/**
 * Extracts init data information from search params.
 */
export const extractInitDataFromSearchParams =
  createSearchParamsStructParser<InitData>({
    queryId: ['query_id', parseSearchParamAsOptString],
    user: ['user', parseUser],
    receiver: ['receiver', parseUser],
    chat: ['chat', parseChat],
    startParam: ['start_param', parseSearchParamAsOptString],
    canSendAfter: ['can_send_after', parseSearchParamAsOptDate],
    authDate: ['auth_date', parseSearchParamAsDate],
    hash: ['hash', parseSearchParamAsString],
  });
