import type { IsSupportedType } from '@/scopes/wrappers/wrapSafe.js';
import { createWrapSafe, type SafeWrapFn } from '@/scopes/wrappers/createWrapSafe.js';

export function createWrapComplete(
  component: string,
  isMounted: () => boolean,
  isSupported: IsSupportedType,
): SafeWrapFn<true> {
  return createWrapSafe(component, { isSupported, isMounted });
}
