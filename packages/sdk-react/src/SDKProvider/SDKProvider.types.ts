import type { AnyFn } from '@tma.js/sdk';
import type { PropsWithChildren } from 'react';

export interface SDKProviderProps extends PropsWithChildren {
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

/**
 * SDKContext item.
 */
export type SDKContextItem<T> = ({
  /**
   * This item execution result. The property may be missing in case, execution is async.
   */
  result?: T;
} | {
  /**
   * An error occurred during execution.
   */
  error: unknown;
});

export interface SDKContextType {
  /**
   * Uses specified factory with the passed arguments. In case, this factory was called
   * previously, a cached result will be returned.
   * @param factory - factory function.
   * @param args - factory arguments.
   */
  use<Fn extends AnyFn>(
    factory: Fn,
    ...args: Parameters<Fn>
  ): SDKContextItem<Awaited<ReturnType<Fn>>>;
}
