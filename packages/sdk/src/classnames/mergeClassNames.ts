import { isRecord } from '@/misc/isRecord.js';
import type { UnionOptionalKeys, UnionRequiredKeys } from '@/types/unions.js';

import { classNames } from './classNames.js';

export type MergeClassNames<Tuple extends any[]> =
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

      if (className.length) {
        (acc as any)[key] = className;
      }
    });

    return acc;
  }, {} as MergeClassNames<T>);
}
