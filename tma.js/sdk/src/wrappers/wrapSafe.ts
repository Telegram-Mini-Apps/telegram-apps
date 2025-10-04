import type { AnyFn } from '@/types.js';
import { type SafeWrappedFp, wrapSafeFp, type WrapSafeOptions } from '@/wrappers/wrap-safe-fp.js';
import { unwrapFp } from '@/wrappers/unwrapFp.js';

export type SafeWrapped<
  Fn extends AnyFn,
  HasSupportCheck extends boolean,
  SupportsMapKeySchema extends string = never,
> = Omit<SafeWrappedFp<Fn, HasSupportCheck, SupportsMapKeySchema>, 'ifAvailable'> & {
  /**
   * Calls the function only in case it is available.
   *
   * It uses the `isAvailable` internally to check if the function is available for call.
   * @example
   * backButton.show.ifAvailable();
   */
  ifAvailable(...args: Parameters<Fn>): { ok: true; data: ReturnType<Fn> } | { ok: false };
};

export function wrapSafe<Fn extends AnyFn, O extends WrapSafeOptions<Parameters<Fn>>>(
  fn: Fn,
  options: O,
): SafeWrapped<
  Fn,
  O extends { isSupported: any } ? true : false,
  O extends { supports: Record<string, any> } ? keyof O['supports'] & string : never
> {
  return unwrapFp(wrapSafeFp(fn, options));
}
