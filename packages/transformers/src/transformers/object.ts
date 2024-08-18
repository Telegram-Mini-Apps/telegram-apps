import { parseBySchema } from '@/parseBySchema.js';
import { toRecord } from '@/toRecord.js';
import { createTransformerGen } from '@/transformers/createTransformerGen.js';
import type { TransformerGen, Schema } from '@/types.js';

export function object<T>(schema: Schema<T>, name?: string): TransformerGen<T> {
  return createTransformerGen((value) => {
    const record = toRecord(value);
    return parseBySchema(schema, (field) => record[field]);
  }, name);
}
