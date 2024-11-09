import type { IsSupported } from '@/scopes/toolkit/wrapSafe.js';
import { createWrapSafe, type SafeWrapFn } from '@/scopes/toolkit/createWrapSafe.js';

export function createWrapComplete(
  component: string,
  isMounted: () => boolean,
  isSupported: IsSupported,
): SafeWrapFn<true> {
  return createWrapSafe(component, { isSupported, isMounted });
}
