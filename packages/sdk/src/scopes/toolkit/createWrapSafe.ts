import type { AnyFn } from '@/types.js';
import {
  wrapSafe,
  type IsSupported,
  type SafeWrapped,
  type Supports,
} from '@/scopes/toolkit/wrapSafe.js';

export interface SafeWrapFn<S extends boolean> {
  <Fn extends AnyFn>(method: string, fn: Fn): SafeWrapped<Fn, S, never>;
  <Fn extends AnyFn>(method: string, fn: Fn, isSupported: IsSupported): SafeWrapped<Fn, true, never>;
  <Fn extends AnyFn, S extends Supports<Fn>>(
    method: string,
    fn: Fn,
    isSupported: IsSupported,
    supports: S,
  ): SafeWrapped<Fn, true, S>;
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
  options ||= {};
  return ((method, fn, overrideIsSupported, supports) => wrapSafe(method, fn, {
    ...options,
    isSupported: overrideIsSupported || options.isSupported,
    supports,
    component,
  })) as SafeWrapFn<boolean>;
}
