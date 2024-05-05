import type { AnyFn } from '@tma.js/sdk';
import type { Accessor, ParentProps } from 'solid-js';

export interface SDKProviderProps extends ParentProps {
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
export type SDKContextType = Map<AnyFn, Accessor<any>>;
