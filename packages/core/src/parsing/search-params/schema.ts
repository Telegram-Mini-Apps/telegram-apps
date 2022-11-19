import {SearchParamsStructSchema} from './types';
import {SchemaParserResult, SchemaParserResultFunc} from '../shared';

/**
 * Creates new parser for search params structure with specified schema.
 * @param schema - parsing schema.
 * @param getDefault - returns default value in case, it is recognized as empty.
 */
export function createSearchParamsStructParser<T, D = T>(
  schema: SearchParamsStructSchema<T>,
  getDefault?: () => D,
): SchemaParserResultFunc<SchemaParserResult<T> | D> {
  return value => {
    if (value === null || value === undefined) {
      if (getDefault === undefined) {
        throw new TypeError('Value is empty.');
      }
      return getDefault();
    }

    // We expect value to be string or URLSearchParams.
    if (typeof value !== 'string' && !(value instanceof URLSearchParams)) {
      throw new TypeError('Value has unexpected type.');
    }

    // Convert value to search params.
    const sp = typeof value === 'string' ? new URLSearchParams(value) : value;
    const result = {} as SchemaParserResult<T>;

    // Iterate over each schema property and extract it from search params.
    for (const prop in schema) {
      const [paramName, parser] = schema[prop];
      try {
        const value = parser(sp.get(paramName));

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