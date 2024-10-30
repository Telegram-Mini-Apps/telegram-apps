import { withIsMounted } from '@/scopes/toolkit/withIsMounted.js';
import type { AnyFn } from '@/types.js';

/*@__NO_SIDE_EFFECTS__*/
export function createWithIsMounted(isMounted: () => boolean) {
  return <Fn extends AnyFn>(fn: Fn): Fn => {
    return withIsMounted(fn, isMounted);
  };
}