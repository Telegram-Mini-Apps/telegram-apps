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
  checkInit?: boolean;
}

export function createWrapSafe<O extends Options>(
  component: string,
  { checkInit, ...rest }: O,
): SafeWrapFn<O extends { isSupported: any } ? true : false> {
  return ((name, fn) => wrapSafe(fn, {
    ...rest,
    component,
    checkInit: typeof checkInit === 'boolean' ? checkInit : true,
    method: name,
  })) as SafeWrapFn<boolean>;
}