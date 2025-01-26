import type { LaunchParams } from '@telegram-apps/types';
import type { InferOutput } from 'valibot';

import type { LaunchParamsSchema } from '@/schemas/LaunchParamsSchema.js';
import { serializeToQuery } from '@/serializers/serializeToQuery.js';
import { serializeInitDataQuery } from '@/serializers/serializeInitDataQuery.js';

export type LaunchParamsLike = InferOutput<typeof LaunchParamsSchema> | LaunchParams;

/**
 * Serializes the LaunchParamsQuery shape.
 * @param value - value to serialize.
 */
export function serializeLaunchParamsQuery(value: LaunchParamsLike): string {
  return serializeToQuery(value, (k, v) => {
    return k === 'tgWebAppData' ? serializeInitDataQuery(v as any) : JSON.stringify(v);
  });
}