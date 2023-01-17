import {Chat, InitData, User} from './types';
import {JsonShape, SearchParamsShape} from '@twa.js/utils';

const userSchema: JsonShape<User> = new JsonShape()
  .string('first_name', 'firstName')
  .number('id')
  .bool('is_bot', 'isBot', true)
  .bool('is_premium', 'isPremium', true)
  .string('last_name', 'lastName', true)
  .string('language_code', 'languageCode', true)
  .string('photo_url', 'photoUrl', true)
  .string('username', true);

const chatSchema: JsonShape<Chat> = new JsonShape()
  .number('id')
  .string('photo_url', 'photoUrl', true)
  .string('type')
  .string('title')
  .string('username', true);

const initDataSchema: SearchParamsShape<InitData> = new SearchParamsShape()
  .date('auth_date', 'authDate')
  .string('hash')
  .custom('user', userSchema, true)
  .custom('receiver', userSchema, true)
  .custom('chat', chatSchema, true)
  .date('can_send_after', 'canSendAfter', true)
  .string('query_id', 'queryId', true)
  .string('start_param', 'startParam', true);

/**
 * Extracts init data from search params presented as string.
 */
function parseInitData(value: string | URLSearchParams): InitData {
  return initDataSchema.parse(value);
}

export {parseInitData};
