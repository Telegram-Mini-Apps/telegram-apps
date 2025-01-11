import {
  looseObject,
  boolean,
  optional,
  string,
  number,
  transform,
  pipe,
  date,
  integer,
  type BaseSchema,
  type InferOutput,
} from 'valibot';
import type { Chat, InitData, User } from '@telegram-apps/types';

import { ccJsonTransformerBasedOn } from '@/ccJsonTransformerBasedOn.js';
import { ccQueryTransformerBasedOn } from '@/ccQueryTransformerBasedOn.js';
import { serializeToQuery } from '@/serializeToQuery.js';

export const user = ccJsonTransformerBasedOn(
  looseObject({
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
  } satisfies {
    [K in keyof User]-?: BaseSchema<unknown, User[K], any>;
  }),
);

export const chat = ccJsonTransformerBasedOn(looseObject({
  id: number(),
  photo_url: optional(string()),
  type: string(),
  title: string(),
  username: optional(string()),
} satisfies {
  [K in keyof Chat]-?: BaseSchema<unknown, Chat[K], any>;
}));

const InitDataObject = looseObject({
  auth_date: pipe(
    string(),
    transform(input => new Date(Number(input) * 1000)),
    date(),
  ),
  can_send_after: optional(pipe(string(), transform(Number), integer())),
  chat: optional(chat()),
  chat_type: optional(string()),
  chat_instance: optional(string()),
  hash: string(),
  query_id: optional(string()),
  receiver: optional(user()),
  start_param: optional(string()),
  signature: string(),
  user: optional(user()),
} satisfies { [K in keyof InitData]-?: unknown });

export const initData = ccQueryTransformerBasedOn(InitDataObject);

/**
 * Serializes the InitDataQuery shape.
 * @param value - value to serialize.
 */
export function serializeInitDataQuery(value: InferOutput<typeof InitDataObject>): string {
  return serializeToQuery(value);
}