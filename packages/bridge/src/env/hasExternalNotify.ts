import { isRecord } from '@/misc/isRecord.js';

/**
 * Returns true in case, passed value contains path `external.notify` property and `notify` is a
 * function.
 * @param value - value to check.
 */
export function hasExternalNotify<T extends object>(value: T): value is (
  T & {
  external: {
    notify: (...args: any) => any;
  };
}) {
  return 'external' in value
    && isRecord(value.external)
    && 'notify' in value.external
    && typeof value.external.notify === 'function';
}
