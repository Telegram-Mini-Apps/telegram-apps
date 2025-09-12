import { transform, TransformAction } from 'valibot';

export type JsonParseAction = TransformAction<string, unknown>;

/**
 * @returns A transformer applying `JSON.parse` to the input.
 */
export function jsonParse(): JsonParseAction {
  return transform(JSON.parse);
}
