import type { AnyFn } from '@/types.js';
import {
  IsSupported,
  wrapSafe,
  SafeWrapped,
} from '@/scopes/toolkit/wrapSafe.js';

export interface SafeWrapFn<S extends boolean> {
  <Fn extends AnyFn>(method: string, fn: Fn): SafeWrapped<Fn, S>;
  <Fn extends AnyFn>(method: string, fn: Fn, isSupported: IsSupported): SafeWrapped<Fn, true>;
}

interface Options {
  isMounted?: () => boolean;
  isSupported?: IsSupported;
}

export function createWrapSafe(component?: string): SafeWrapFn<false>;

export function createWrapSafe<O extends Options>(
  component: string,
  options: O,
): SafeWrapFn<O extends { isSupported: any } ? true : false>;

export function createWrapSafe(
  component?: string,
  options?: Options,
): SafeWrapFn<boolean> {
  return ((method, fn) => wrapSafe(method, fn, {
    ...options,
    component,
  })) as SafeWrapFn<boolean>;
}
