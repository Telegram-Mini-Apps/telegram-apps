/**
 * Represents a record, where key is class key name, and value is its generated
 * class name.
 */
type Classes = Record<string, string>;

/**
 * Uses `a` classes as source and appends values from `b` by keys.
 * @param a
 * @param b
 */
export function mergeClasses<T extends Classes>(a: T, b: Classes): T {
  return Object.entries(a).reduce<T>((acc, [key, value]) => {
    (acc as any)[key] = value + (typeof b[key] === 'string' ? ' ' + b[key] : '');
    return acc;
  }, {} as T);
}