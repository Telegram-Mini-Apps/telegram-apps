import { TypedError } from '@telegram-apps/bridge';

import { ERR_NOT_MOUNTED } from '@/errors.js';

export function withIsMounted<Fn extends (...args: any[]) => any>(
  fn: Fn,
  isMounted: () => boolean,
): Fn {
  return ((...args) => {
    if (!isMounted()) {
      throw new TypedError(ERR_NOT_MOUNTED);
    }
    return fn(...args);
  }) as Fn;
}