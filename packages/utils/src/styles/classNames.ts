export type ClassNamesValue =
  | undefined
  | null
  | boolean
  | string
  | number
  | Record<string, boolean | null | undefined>;

/**
 * Inserts a space between a and b in case both of them are
 * non-empty strings.
 * @param a
 * @param b
 */
function space(a: string, b: string): string {
  return a + (a.length > 0 && b.length > 0 ? ` ${b}` : b);
}

/**
 * Function which joins passed values with space following these rules:
 * 1. If value is null, undefined or empty string, it will be skipped.
 * 2. If value is string or number, it will be added to output.
 * 3. If value is object, only those keys will be added, which values are true.
 *
 * You can find this function to similar one from package {@link https://www.npmjs.com/package/classnames|classnames}.
 * @param values - values array.
 */
export function classNames(...values: ClassNamesValue[]): string {
  return values.reduce<string>((valueAcc, value) => {
    if (
      value === null
      || value === undefined
      || (typeof value === 'string' && value.length === 0)
      || typeof value === 'boolean'
    ) {
      return valueAcc;
    }

    let formatted: string;

    if (typeof value === 'string') {
      formatted = value;
    } else if (typeof value === 'number') {
      formatted = value.toString();
    } else {
      formatted = Object
        .entries(value)
        .reduce<string>((acc, [className, enable]) => (enable ? space(acc, className) : acc), '');
    }

    return space(valueAcc, formatted);
  }, '');
}
