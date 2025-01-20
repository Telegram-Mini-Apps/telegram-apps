import {
  createWrapSafe,
  type SafeWrapFn,
} from '@/scopes/wrappers/createWrapSafe.js';
import type { IsSupportedType } from '@/scopes/wrappers/wrapSafe.js';

export function createWrapSupported(
  component: string,
  isSupported: IsSupportedType,
): SafeWrapFn<true> {
  return createWrapSafe(component, { isSupported });
}