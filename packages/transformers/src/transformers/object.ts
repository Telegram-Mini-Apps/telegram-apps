import { parseBySchema } from '@/parseBySchema.js';
import { toRecord } from '@/toRecord.js';
import type { TransformerGen, Schema } from '@/types.js';

import { createTransformerGen } from './createTransformerGen.js';

export function object<T>(schema: Schema<T>, name?: string): TransformerGen<T> {
  return createTransformerGen(name || 'object', v => {
    const record = toRecord(v);
    return parseBySchema(schema, f => record[f]);
  });
}
