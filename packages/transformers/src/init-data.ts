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
} from 'valibot';
import type { InitData } from '@telegram-apps/types';
import {
  type ConvertCamelKeysToSnakeCase,
  deepSnakeToCamelObjKeys,
  type SnakeToCamelCase,
} from '@telegram-apps/toolkit';

import { query, queryToRecord, transformUsing, jsonParse } from '@/transformers.js';

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
    [K in keyof ConvertCamelKeysToSnakeCase<InitData>]-?: BaseSchema<
      string | undefined,
      Date extends InitData[SnakeToCamelCase<K>]
        ? InitData[SnakeToCamelCase<K>]
        : ConvertCamelKeysToSnakeCase<InitData[SnakeToCamelCase<K>]>,
      any
    >;
  })),
  // Adjust the output type as long as looseObject breaks it a bit.
  transform(v => v as typeof v & Record<string, string | string[]>),
);

/**
 * Transformer extracting init data in its initial format from the query parameters.
 * The result will be deeply camel-cased.
 */
export const InitDataQueryCamelCased = pipe(
  InitDataQuery,
  transform(deepSnakeToCamelObjKeys),
);
