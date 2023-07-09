import { isRecord } from '@twa.js/utils';

type AnyFunc = (...args: unknown[]) => unknown;

/**
 * Returns true in case, passed value contains function property `notify`.
 * @param value - value to check.
 */
export function hasNotify<T extends {}>(value: T): value is T & { notify: AnyFunc } {
  return 'notify' in value && typeof value.notify === 'function';
}

/**
 * Returns true in case, passed value contains object property `external`.
 * @param value - value to check.
 */
export function hasExternal<T extends {}>(value: T): value is T & {
  external: Record<string, unknown>
} {
  return 'external' in value && isRecord(value.external);
}

/**
 * Returns true in case, passed value contains function property `notify`.
 * @param value - value to check.
 */
export function hasInvoke<T extends {}>(value: T): value is T & { invoke: AnyFunc } {
  return 'invoke' in value && typeof value.invoke === 'function';
}

/**
 * Returns true in case, current environment is iframe.
 * @see https://stackoverflow.com/a/326076
 */
export function isIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
