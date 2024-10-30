import type { MethodName } from '@telegram-apps/bridge';

import { withIsSupported, type WithIsSupported } from '@/scopes/toolkit/withIsSupported.js';
import type { AnyFn } from '@/types.js';

/*@__NO_SIDE_EFFECTS__*/
export function createWithIsSupported(isSupportedOrMethod: MethodName | (() => boolean)) {
  return <Fn extends AnyFn>(fn: Fn): WithIsSupported<Fn> => {
    return withIsSupported(fn, isSupportedOrMethod as unknown as any);
  };
}