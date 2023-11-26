import { classNames } from './classNames.js';

type FilterUnion<U> = Exclude<U, number | string | null | undefined | any[] | boolean>;

/**
 * Returns union keys removing those, which values are not strings.
 */
type UnionFilteredKeys<U> = U extends U
  ? {
    [K in keyof U]: U[K] extends string ? K : never
  }[keyof U]
  : never;

/**
 * Returns union required keys.
 */
type UnionRequiredKeys<U> = U extends U
  ? {
    [K in UnionFilteredKeys<U>]-?: ({} extends { [P in K]: U[K] } ? never : K)
  }[UnionFilteredKeys<U>]
  : never;

/**
 * Returns union optional keys.
 */
type UnionOptionalKeys<U> = Exclude<UnionFilteredKeys<U>, UnionRequiredKeys<U>>;

type MergeClassNames<Tuple extends any[]> = Tuple[number] extends infer Union
  ? FilterUnion<Union> extends infer UnionFiltered
    ? {
      [K in UnionRequiredKeys<UnionFiltered>]: string;
    } & {
      [K in UnionOptionalKeys<UnionFiltered>]?: string;
    }
    : never
  : never;

/**
 * Returns true in case, passed value is Record.
 * @param value
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(null);
}

/**
 * Merges 2 sets of parameters. Function expects passing an array of objects with values, which
 * could be passed to `classNames` function. As the result, it returns an object with keys
 * from all objects with merged values.
 * @see classNames
 */
export function mergeClassNames<T extends any[]>(...partials: T): MergeClassNames<T> {
  return partials.reduce<MergeClassNames<T>>((acc, partial) => {
    if (!isObject(partial)) {
      return acc;
    }

    Object.entries(partial).forEach(([key, value]) => {
      const className = classNames((acc as any)[key], value);

      if (className.length > 0) {
        (acc as any)[key] = className;
      }
    });

    return acc;
  }, {} as MergeClassNames<T>);
}
