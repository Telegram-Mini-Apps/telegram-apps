import { createWrapSafe, type SafeWrapFn } from '@/scopes/wrappers/createWrapSafe.js';

export function createWrapMounted(
  component: string,
  isMounted: () => boolean,
): SafeWrapFn<false> {
  return createWrapSafe(component, { isMounted });
}