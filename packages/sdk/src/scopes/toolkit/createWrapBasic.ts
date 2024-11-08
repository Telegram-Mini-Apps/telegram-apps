import {
  createWrapSafe,
  type SafeWrapFn,
} from '@/scopes/toolkit/createWrapSafe.js';

export function createWrapBasic(component: string): SafeWrapFn<false> {
  return createWrapSafe(component, {});
}