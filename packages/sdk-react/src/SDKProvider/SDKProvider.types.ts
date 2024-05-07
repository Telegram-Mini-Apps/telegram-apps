import type { AnyFn } from '@tma.js/sdk';
import type { PropsWithChildren } from 'react';

export interface SDKProviderProps extends PropsWithChildren {
  /**
   * True if SDK should accept styles sent from the Telegram web application. This option is only
   * used in web versions of Telegram.
   * @default true
   */
  acceptCustomStyles?: boolean;
}

/**
 * SDK context represents a map, where key is component init function, and value is an accessor,
 * retrieving its result.
 */
export interface SDKContextType {
  get(fn: AnyFn): any;
  set(fn: AnyFn, value: any): any;
  has(fn: AnyFn): boolean;
}
