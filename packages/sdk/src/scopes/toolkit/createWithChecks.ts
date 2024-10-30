import type { MethodName } from '@telegram-apps/bridge';

import { createWithIsSupported } from '@/scopes/toolkit/createWithIsSupported.js';
import { withIsMounted } from '@/scopes/toolkit/withIsMounted.js';
import type { AnyFn } from '@/types.js';
import type { WithIsSupported } from '@/scopes/toolkit/withIsSupported.js';

/*@__NO_SIDE_EFFECTS__*/
export function createWithChecks(
  isSupportedOrMethod: MethodName | (() => boolean),
  isMounted: () => boolean,
) {
  const withIsSupported = createWithIsSupported(isSupportedOrMethod);

  return <Fn extends AnyFn>(fn: Fn): WithIsSupported<Fn> => {
    return withIsSupported(withIsMounted(fn, isMounted));
  };
}