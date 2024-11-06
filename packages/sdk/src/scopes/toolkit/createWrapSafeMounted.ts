import { createWrapSafe, SafeWrapFn } from '@/scopes/toolkit/createWrapSafe.js';

export function createWrapSafeMounted(
  component: string,
  isMounted: () => boolean,
): SafeWrapFn<false> {
  return createWrapSafe(component, {
    isMounted,
    checkInit: false,
  });
}