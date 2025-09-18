import type { AnyFn } from '@/types.js';

type PickFnProps<T> = {
  [K in keyof T]: T[K] extends AnyFn ? K : never;
}[keyof T];

/**
 * Extracts `prop` property from the `obj` object and binds it to `obj`.
 * @param obj
 * @param prop
 */
export function bound<O extends object, P extends PickFnProps<O>>(
  obj: O,
  prop: P,
): O[P] {
  return (obj[prop] as any).bind(obj);
}
