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
import type { InitData } from '@telegram-apps/types';

import { query, queryToRecord, transformUsing, jsonParse } from '@/transformers.js';
import { serializeToQuery } from '@/serializeToQuery.js';

const User = pipe(
  string(),
  jsonParse(),
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
  }),
);

/**
 * Transformer extracting init data in its initial format from the query parameters.
 */
export const InitDataQuery = pipe(
  query(),
  queryToRecord(),
  transformUsing(looseObject({
    auth_date: pipe(
      string(),
      transform(input => new Date(Number(input) * 1000)),
      date(),
    ),
    can_send_after: optional(pipe(string(), transform(Number), integer())),
    chat: optional(
      pipe(
        string(),
        jsonParse(),
        looseObject({
          id: number(),
          photo_url: optional(string()),
          type: string(),
          title: string(),
          username: optional(string()),
        }),
      ),
    ),
    chat_type: optional(string()),
    chat_instance: optional(string()),
    hash: string(),
    query_id: optional(string()),
    receiver: optional(User),
    start_param: optional(string()),
    signature: string(),
    user: optional(User),
  } satisfies {
    // Making sure, we specified transformers for all init data properties.
    [K in keyof InitData]-?: BaseSchema<string | undefined, InitData[K], any>;
  })),
);

/**
 * Serializes the InitDataQuery shape.
 * @param value - value to serialize.
 */
export function serializeInitDataQuery(value: InferOutput<typeof InitDataQuery>): string {
  return serializeToQuery(value);
}