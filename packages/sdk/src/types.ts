import type { RequestOptions } from '@telegram-apps/bridge';
import type { PromiseOptions } from 'better-promises';

/**
 * Function with any arguments list and return type.
 */
export type AnyFn = (...args: any[]) => any;

export type RequestOptionsNoCapture = Omit<RequestOptions<never>, 'capture'>;

export type AsyncOptions = Omit<PromiseOptions, 'rejectOnAbort'>;