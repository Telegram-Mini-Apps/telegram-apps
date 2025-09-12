import { InferOutput } from 'valibot';
import { InitData } from '@telegram-apps/types';

import type { InitDataQuerySchema } from '@/schemas/init-data.js';
import { serializeToQuery } from '@/serializers/serializeToQuery.js';

export type InitDataLike = InferOutput<typeof InitDataQuerySchema> | InitData;

/**
 * Serializes the InitDataQuery shape.
 * @param value - value to serialize.
 */
export function serializeInitDataQuery(value: InitDataLike): string {
  return serializeToQuery(value);
}