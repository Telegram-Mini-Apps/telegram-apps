import type { AnyFn } from '@/types.js';
import {
  IsSupported,
  assignChecks,
  SafeWrapped,
} from '@/scopes/toolkit/assignChecks.js';

export interface SafeWrapFn<S extends boolean> {
  <Fn extends AnyFn>(name: string, fn: Fn): SafeWrapped<Fn, S>;
  <Fn extends AnyFn>(name: string, fn: Fn, isSupported: IsSupported): SafeWrapped<Fn, true>;
}

interface Options {
  isMounted?: () => boolean;
  isSupported?: IsSupported;
  checkInit?: boolean;
}

export function createAssignChecks<O extends Options>(
  component: string,
  { checkInit, ...rest }: O,
): SafeWrapFn<O extends { isSupported: any } ? true : false> {
  return ((name, fn) => assignChecks(fn, {
    ...rest,
    component,
    checkInit: typeof checkInit === 'boolean' ? checkInit : true,
    method: name,
  })) as SafeWrapFn<boolean>;
}
