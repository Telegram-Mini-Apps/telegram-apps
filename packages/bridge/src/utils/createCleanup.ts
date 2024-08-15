import type { VoidFn } from '@telegram-apps/util-types';

export type CleanupFn = VoidFn;

/**
 * Returns a tuple, containing function to add cleanup, call cleanup, and flag showing whether
 * cleanup was called. Cleanup will not be performed in case, it was done before.
 */
export function createCleanup(...fns: (CleanupFn | CleanupFn[])[]): [
  /**
   * Adds new functions to be called on cleanup.
   */
  add: (...fns: CleanupFn[]) => void,
  /**
   * Performs cleanup.
   */
  cleanup: () => void,
  /**
   * True if cleanup was already performed.
   */
  cleanedUp: boolean,
] {
  let cleanedUp = false;
  const cache = fns.flat(1);

  return [
    (...fns) => !cleanedUp && cache.push(...fns),
    () => {
      if (!cleanedUp) {
        cleanedUp = true;
        cache.forEach(clean => clean());
      }
    },
    cleanedUp,
  ];
}