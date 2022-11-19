import {RGBColor, toRGB} from '../../colors';
import {JsonParser} from './types';
import {isRecord} from '../../validation';

/**
 * Converts value received from some JSON to Record<string, unknown>.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJsonParamAsRecord: JsonParser<Record<string, unknown>> = value => {
  if (!isRecord(value)) {
    throw new TypeError(`Unable to parse "${value}" as Record`);
  }
  return value;
};

/**
 * Converts value received from some JSON to number.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJsonParamAsNum: JsonParser<number> = value => {
  if (typeof value !== 'number') {
    throw new TypeError(`Unable to parse "${value}" as number`);
  }
  return value;
};

/**
 * Converts value received from some JSON to number or undefined.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJsonParamAsOptNum: JsonParser<number | null> = value =>
  value === undefined ? null : parseJsonParamAsNum(value);

/**
 * Converts value received from some JSON to string.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJsonParamAsString: JsonParser<string> = value => {
  if (typeof value !== 'string') {
    throw new TypeError(`Unable to parse "${value}" as string`);
  }
  return value;
};

/**
 * Converts value received from some JSON to string or undefined.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJsonParamAsOptString: JsonParser<string | undefined> =
  value => value === undefined ? value : parseJsonParamAsString(value);

/**
 * Converts value received from some JSON to boolean.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJsonParamAsBool: JsonParser<boolean> = value => {
  if (typeof value !== 'boolean') {
    throw new TypeError(`Unable to parse "${value}" as boolean`);
  }
  return value;
};

/**
 * Converts value received from some JSON to boolean or undefined.
 * @param value - raw value.
 */
export const parseJsonParamAsOptBool: JsonParser<boolean | undefined> = value =>
  value === undefined ? undefined : parseJsonParamAsBool(value);

/**
 * Converts value received from some JSON to RGB in full format or undefined.
 * @param value - raw value.
 * @throws {TypeError} Value has incorrect type.
 */
export const parseJsonParamAsOptRGB: JsonParser<RGBColor | undefined> =
  value => value === undefined ? value : toRGB(parseJsonParamAsString(value));
