import { withIsMounted } from '@/scopes/toolkit/withIsMounted.js';

/*@__NO_SIDE_EFFECTS__*/
export function createWithIsMounted(isMounted: () => boolean) {
  return <Fn extends (...args: any[]) => any>(fn: Fn): Fn => {
    return withIsMounted(fn, isMounted);
  };
}