import type { AnyFn } from '@/types.js';
import {
  IsSupported,
  wrapSafe,
  SafeWrapped,
} from '@/scopes/toolkit/wrapSafe.js';

export interface SafeWrapFn<S extends boolean> {
  <Fn extends AnyFn>(name: string, fn: Fn): SafeWrapped<Fn, S>;
  <Fn extends AnyFn>(name: string, fn: Fn, isSupported: IsSupported): SafeWrapped<Fn, true>;
}

interface Options {
  isMounted?: () => boolean;
  isSupported?: IsSupported;
}

export function createWrapSafe<O extends Options>(
  component: string,
  options: O,
): SafeWrapFn<O extends { isSupported: any } ? true : false> {
  return ((name, fn) => wrapSafe(fn, {
    ...options,
    component,
    method: name,
  })) as SafeWrapFn<boolean>;
}
