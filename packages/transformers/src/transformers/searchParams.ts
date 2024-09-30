import { throwUnexpectedValue } from '@/errors/throwUnexpectedValue.js';
import { parseBySchema } from '@/parseBySchema.js';
import type { Schema, TransformerGen } from '@/types.js';

import { createTransformerGen } from './createTransformerGen.js';

export function searchParams<T>(schema: Schema<T>, name?: string): TransformerGen<T> {
  return createTransformerGen(name || 'searchParams', v => {
    if (typeof v !== 'string' && !(v instanceof URLSearchParams)) {
      throwUnexpectedValue(v);
    }

    const params = typeof v === 'string' ? new URLSearchParams(v) : v;

    return parseBySchema(schema, (field) => {
      const paramValue = params.get(field);
      return paramValue === null ? undefined : paramValue;
    });
  });
}
