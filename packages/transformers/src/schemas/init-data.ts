import {
  type BaseSchema, boolean,
  date, integer, lazy,
  looseObject,
  number,
  optional,
  pipe,
  string,
  transform,
} from 'valibot';
import type { Chat, InitData, User } from '@telegram-apps/types';

import { initDataChatJson, initDataUserJson } from '@/generators/init-data.js';

const lazyUser = optional(lazy(() => initDataUserJson()));

export const InitDataChatSchema = looseObject({
  id: number(),
  photo_url: optional(string()),
  type: string(),
  title: string(),
  username: optional(string()),
} satisfies { [K in keyof Chat]-?: BaseSchema<unknown, Chat[K], any> });

export const InitDataUserSchema = looseObject({
  added_to_attachment_menu: optional(boolean()),
  allows_write_to_pm: optional(boolean()),
  first_name: string(),
  id: number(),
  is_bot: optional(boolean()),
  is_premium: optional(boolean()),
  last_name: optional(string()),
  language_code: optional(string()),
  photo_url: optional(string()),
  username: optional(string()),
} satisfies { [K in keyof User]-?: BaseSchema<unknown, User[K], any> });

export const InitDataQuerySchema = looseObject({
  auth_date: pipe(
    string(),
    transform(input => new Date(Number(input) * 1000)),
    date(),
  ),
  can_send_after: optional(pipe(string(), transform(Number), integer())),
  chat: optional(lazy(() => initDataChatJson())),
  chat_type: optional(string()),
  chat_instance: optional(string()),
  hash: string(),
  query_id: optional(string()),
  receiver: lazyUser,
  start_param: optional(string()),
  signature: string(),
  user: lazyUser,
} satisfies { [K in keyof InitData]-?: unknown });