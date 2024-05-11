import type { AnyFn } from '@tma.js/sdk';
import type { ParentProps } from 'solid-js';

export interface SDKProviderProps extends ParentProps {
  /**
   * True if SDK should accept styles sent from the Telegram web application. This option is only
   * used in web versions of Telegram.
   * @default true
   */
  acceptCustomStyles?: boolean;
  /**
   * Enables debug mode.
   * @default false
   */
  debug?: boolean;
}

export interface SDKContextItem<Factory extends AnyFn> {
  /**
   * Returns factory execution result.
   * @throws An error, if it occurred during factory call. Use the "error" property before
   * to check if something went wrong.
   */
  (): ReturnType<Factory> extends PromiseLike<infer T> ? T | undefined : ReturnType<Factory>;
  /**
   * Error occurred during factory call.
   */
  error?: unknown;
}

export interface SDKContextType {
  /**
   * Uses specified factory with the passed arguments. In case, this factory was called
   * previously, a cached result will be returned.
   * @param factory - factory function.
   * @param args - factory arguments.
   */
  <Fn extends AnyFn>(factory: Fn, ...args: Parameters<Fn>): SDKContextItem<Fn>;
}
