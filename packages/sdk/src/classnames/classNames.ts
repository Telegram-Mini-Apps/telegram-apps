import { isRecord } from '~/misc/isRecord.js';

/**
 * Inserts a space between a and b in case both of them are
 * non-empty strings.
 * @param a
 * @param b
 */
function space(a: string, b: string): string {
  return a + (a.length && b.length ? ` ${b}` : b);
}

/**
 * Function which joins passed values with space following these rules:
 * 1. If value is non-empty string, it will be added to output.
 * 2. If value is object, only those keys will be added, which values are truthy.
 * 3. If value is array, classNames will be called with this value spread.
 * 4. All other values are ignored.
 *
 * You can find this function to similar one from the package {@link https://www.npmjs.com/package/classnames|classnames}.
 * @param values - values array.
 * @returns Final class name.
 */
export function classNames(...values: any[]): string {
  return values.reduce((acc, value) => {
    if (typeof value === 'string') {
      return space(acc, value);
    }

    if (isRecord(value)) {
      return space(acc, Object.entries(value).reduce((valueAcc, entry) => {
        return (entry[1] ? space(valueAcc, entry[0]) : valueAcc);
      }, ''));
    }

    if (Array.isArray(value)) {
      return space(acc, classNames(...value));
    }

    return acc;
  }, '');
}
