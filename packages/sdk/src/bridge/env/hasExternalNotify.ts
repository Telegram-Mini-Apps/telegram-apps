import { isRecord } from '../../misc/isRecord.js';

type WithExternalNotify<T> = T & {
  external: {
    notify: (...args: any) => any;
  };
};

/**
 * Returns true in case, passed value contains path `external.notify` property and `notify` is a
 * function.
 * @param value - value to check.
 */
export function hasExternalNotify<T extends {}>(value: T): value is WithExternalNotify<T> {
  return 'external' in value
    && isRecord(value.external)
    && 'notify' in value.external
    && typeof value.external.notify === 'function';
}
