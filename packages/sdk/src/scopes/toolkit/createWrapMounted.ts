import { createWrapSafe, SafeWrapFn } from '@/scopes/toolkit/createWrapSafe.js';

export function createWrapMounted(
  component: string,
  isMounted: () => boolean,
): SafeWrapFn<false> {
  return createWrapSafe(component, { isMounted, checkInit: false });
}