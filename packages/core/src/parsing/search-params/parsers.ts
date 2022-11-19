import {SearchParamsParser} from './types';

/**
 * Parses URL search parameter as string.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseSearchParamAsString: SearchParamsParser<string> = value => {
  if (value === null) {
    throw new TypeError(`Unable to parse value "${value}" as string.`);
  }
  return value;
};

/**
 * Parses URL search parameter as optional string.
 * @param value - raw value.
 */
export const parseSearchParamAsOptString: SearchParamsParser<string | undefined> =
  value => value === null ? undefined : value;

/**
 * Parses URL search parameter as Date.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseSearchParamAsDate: SearchParamsParser<Date> = value => {
  if (value !== null && value !== '') {
    const asInt = parseInt(value);
    const date = new Date(asInt.toString() === value ? asInt * 1000 : value);

    if (date.toString() !== 'Invalid Date') {
      return date;
    }
  }
  throw new TypeError(`Unable to parse value "${value}" as Date`);
};

/**
 * Parses SearchParams parameter as optional Date.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseSearchParamAsOptDate: SearchParamsParser<Date | undefined> = value => {
  if (value === null) {
    return;
  }
  return parseSearchParamAsDate(value);
};
