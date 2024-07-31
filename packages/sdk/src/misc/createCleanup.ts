import type { CleanupFn } from '@/types/index.js';

/**
 * Returns a tuple, containing function to add cleanup, call cleanup, and flag showing whether
 * cleanup was called. Cleanup will not be performed in case, it was done before.
 */
export function createCleanup(...fns: (CleanupFn | CleanupFn[])[]): [
  add: (...fns: CleanupFn[]) => void,
  cleanup: () => void,
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