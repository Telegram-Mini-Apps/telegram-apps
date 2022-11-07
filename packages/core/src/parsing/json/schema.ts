import {JsonStructSchema} from './types';
import {SchemaParserResult, SchemaParserResultFunc} from '../shared';
import {isRecord} from '../../validation';

/**
 * Creates new parser for JSON structure with specified schema. In case, string
 * value was passed, parser tries to convert it to JSON.
 *
 * @param schema - parsing schema.
 * @param getDefault - returns default value in case, it is recognized as empty.
 */
export function createJsonStructParser<T, D = T>(
  schema: JsonStructSchema<T>,
  getDefault?: () => D,
): SchemaParserResultFunc<SchemaParserResult<T> | D> {
  return value => {
    if (value === null || value === undefined) {
      if (getDefault === undefined) {
        throw new TypeError('Value is empty.');
      }
      return getDefault();
    }
    let json: any = value;

    // Convert value to JSON in case, it is string. We expect value to be
    // JSON string.
    if (typeof json === 'string') {
      try {
        json = JSON.parse(json);
      } catch (e) {
        throw new TypeError('Value is not JSON object converted to string.');
      }
    }

    // We expect json to be usual object.
    if (!isRecord(json)) {
      throw new TypeError('Value is not JSON object.');
    }

    // Iterate over each schema property and extract it from JSON.
    const result = {} as SchemaParserResult<T>;
    for (const prop in schema) {
      const [paramName, parser] = schema[prop];
      try {
        const value = parser(json[paramName]);

        if (value !== undefined) {
          (result as any)[prop] = value;
        }
      } catch (e) {
        throw new Error(`Unable to parse parameter "${paramName}"`, {cause: e});
      }
    }
    return result;
  };
}
