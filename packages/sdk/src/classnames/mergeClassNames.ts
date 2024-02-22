import { isRecord } from '~/misc';

import { classNames } from './classNames.js';

/**
 * Returns union keys removing those, which values are not strings.
 */
type UnionStringKeys<U> = U extends U
  ? {
    [K in keyof U]-?: U[K] extends string | undefined ? K : never;
  }[keyof U]
  : never;

/**
 * Returns union required keys.
 */
type UnionRequiredKeys<U> = U extends U
  ? {
    [K in UnionStringKeys<U>]: ({} extends Pick<U, K> ? never : K)
  }[UnionStringKeys<U>]
  : never;

/**
 * Returns union optional keys.
 */
type UnionOptionalKeys<U> = Exclude<UnionStringKeys<U>, UnionRequiredKeys<U>>;

type MergeClassNames<Tuple extends any[]> =
  // Removes all types from union which will be ignored by the mergeClassNames function.
  Exclude<Tuple[number], number | string | null | undefined | any[] | boolean> extends infer Union
    ? {
    [K in UnionRequiredKeys<Union>]: string;
  } & {
    [K in UnionOptionalKeys<Union>]?: string;
  }
    : never;

/**
 * Merges 2 sets of parameters. Function expects passing an array of objects with values, which
 * could be passed to `classNames` function. As the result, it returns an object with keys
 * from all objects with merged values.
 * @see classNames
 */
export function mergeClassNames<T extends any[]>(...partials: T): MergeClassNames<T> {
  return partials.reduce<MergeClassNames<T>>((acc, partial) => {
    if (!isRecord(partial)) {
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
