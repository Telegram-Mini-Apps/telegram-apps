import { classNames, ClassNamesValue } from './classNames.js';

type RequiredKeys<T extends {}> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

type OptionalKeys<T extends {}> = Exclude<keyof T, RequiredKeys<T>>;

type MergeClassNames<A extends {}, B extends {}> = {
  [K in RequiredKeys<A & B>]: string
} & {
  [K in OptionalKeys<A & B>]?: string;
};

type ClassNames = Record<string, ClassNamesValue>;

/**
 * Merges 2 sets of parameters. Before using this function, make sure `a`
 * and `b` are Record<string, ClassNamesValue>.
 * @see ClassNamesValue
 * @param a - first set of parameters.
 * @param b - second set of parameters.
 */
export function mergeClassNames<A extends ClassNames, B extends ClassNames>(
  a: A,
  b: B,
): MergeClassNames<A, B> {
  const keys = [...Object.keys(a), ...Object.keys(b)];

  return keys.reduce<MergeClassNames<A, B>>((acc, key) => {
    const value = classNames(a[key], b[key]);

    if (value.length > 0) {
      (acc as any)[key] = value;
    }

    return acc;
  }, {} as MergeClassNames<A, B>);
}
