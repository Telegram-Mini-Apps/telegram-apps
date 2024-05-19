import { CleanupFn } from '@/types/index.js';

/**
 * Returns a tuple, containing function to add cleanup, call cleanup, and flag showing whether
 * cleanup was called. Cleanup will not be performed in case, it was done before.
 */
export function createCleanup(...fns: CleanupFn[]): [
  add: (fn: CleanupFn) => void,
  call: () => void,
  cleanedUp: boolean,
] {
  let called = false;
  const cache: CleanupFn[] = [...fns];

  return [
    (fn) => !called && cache.push(fn),
    () => {
      if (!called) {
        called = true;
        cache.forEach(clean => clean());
      }
    },
    called,
  ];
}