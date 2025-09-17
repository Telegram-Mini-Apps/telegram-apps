import type { RequestFpOptions } from '@tma.js/bridge';
import type { BetterPromiseOptions } from 'better-promises';

/**
 * Function with any arguments list and return type.
 */
export type AnyFn = (...args: any[]) => any;

/**
 * `request` options without `capture` option specified.
 */
export type RequestOptionsNoCapture = Omit<RequestFpOptions<never>, 'capture'>;

export type AsyncOptions = Omit<BetterPromiseOptions, 'abortOnResolve' | 'abortOnReject'>;

export type MaybeAccessor<T> = T | (() => T);
