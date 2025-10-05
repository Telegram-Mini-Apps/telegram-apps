import type { RequestFpOptions } from '@tma.js/bridge';
import type { BetterPromiseOptions } from 'better-promises';

/**
 * `request` options without `capture` and `postEvent` options specified.
 */
export type RequestOptionsNoCapture = Omit<RequestFpOptions<never>, 'capture' | 'postEvent'>;

export type AsyncOptions = Omit<BetterPromiseOptions, 'abortOnResolve' | 'abortOnReject'>;

export type MaybeAccessor<T> = T | (() => T);
