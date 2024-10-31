import type { AnyFn } from '@/types.js';
import { IsSupported, safeWrap, SafeWrapped } from '@/scopes/toolkit/safeWrap.js';

interface SafeWrapFn<S extends boolean> {
  <Fn extends AnyFn>(name: string, fn: Fn): SafeWrapped<Fn, S>;
  <Fn extends AnyFn>(name: string, fn: Fn, isSupported: IsSupported): SafeWrapped<Fn, true>;
}

export function createSafeWrap(
  component: string,
  isMounted?: () => boolean,
): SafeWrapFn<false>;

export function createSafeWrap(
  component: string,
  isMounted: (() => boolean) | undefined,
  isSupported: IsSupported,
): SafeWrapFn<true>;

export function createSafeWrap(
  component: string,
  isMounted?: () => boolean,
  isSupported?: IsSupported,
): SafeWrapFn<boolean> {
  return ((name, fn) => safeWrap(fn, {
    isSupported,
    isMounted,
    component,
    method: name,
  })) as SafeWrapFn<boolean>;
}