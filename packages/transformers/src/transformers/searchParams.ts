import { createTransformerGen } from '@/transformers/createTransformerGen.js';
import { createTypeError } from '@/errors/createTypeError.js';
import { parseBySchema } from '@/parseBySchema.js';
import type { Schema, TransformerGen } from '@/types.js';

export function searchParams<T>(schema: Schema<T>, name?: string): TransformerGen<T> {
  return createTransformerGen(value => {
    if (typeof value !== 'string' && !(value instanceof URLSearchParams)) {
      throw createTypeError();
    }

    const params = typeof value === 'string' ? new URLSearchParams(value) : value;

    return parseBySchema(schema, (field) => {
      const paramValue = params.get(field);
      return paramValue === null ? undefined : paramValue;
    });
  }, name);
}
