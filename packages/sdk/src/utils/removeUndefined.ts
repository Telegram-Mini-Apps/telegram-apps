import type { UnionRequiredKeys } from '@telegram-apps/toolkit';

type RemoveUndefined<T> = {
  [K in UnionRequiredKeys<T>]-?: T[K]
};

/**
 * @returns Object with keys having undefined values.
 * @param value - an object to remove undefined values from.
 */
export function removeUndefined<T extends {}>(value: T): RemoveUndefined<T> {
  // TODO: Check via caniuse: Object.fromEntries
  return Object.fromEntries(
    Object.entries(value).filter((tuple) => tuple[1] !== undefined),
  ) as RemoveUndefined<T>;
}