import { parseBySchema } from '../parseBySchema.js';
import { toRecord } from '../toRecord.js';
import type { Schema } from '../types.js';
import { ValueParser } from '../ValueParser.js';

/**
 * Creates new Json parser according to passed schema.
 * @param schema - object schema.
 * @param type - parser type name.
 */
export function json<T>(schema: Schema<T>, type?: string): ValueParser<T, false> {
  return new ValueParser((value) => {
    const record = toRecord(value);

    return parseBySchema(schema, (field) => record[field]);
  }, false, type);
}
