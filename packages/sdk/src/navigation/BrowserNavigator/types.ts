import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { BrowserNavigator } from '@/navigation/BrowserNavigator/BrowserNavigator.js';

/**
 * Minimal set of properties we are working with in this library.
 */
export interface URLLike extends Pick<URL, 'pathname' | 'search' | 'hash'> {
}

export interface BrowserNavigatorConOptions {
  /**
   * Base navigator URL.
   * @default ""
   */
  base?: string;
  /**
   * Hash navigation mode. Omit, if non-hash mode is required.
   */
  hashMode?: BrowserNavigatorHashMode;
  /**
   * Function to call Mini Apps methods.
   * @default Global postEvent function.
   */
  postEvent?: PostEvent;
}

export interface BrowserNavigatorHistoryItemParams<State> extends Pick<URLLike, 'search' | 'hash'> {
  state?: State;
}

export interface BrowserNavigatorHistoryItem<State> extends URLLike {
  id: string;
  state?: State;
}

export type BrowserNavigatorAnyHistoryItem<State> =
  | string
  | Partial<BrowserNavigatorHistoryItem<State>>;

/**
 * Hash navigation mode.
 * @example 'default'
 * '#pathname?search'
 * @example 'slash'
 * '#/pathname?search'
 */
export type BrowserNavigatorHashMode = 'default' | 'slash';

/**
 * Events supported by `BrowserNavigator`.
 */
export interface BrowserNavigatorEvents<State> {
  change: {
    /**
     * Navigator instance.
     */
    navigator: BrowserNavigator<State>
    /**
     * Navigator cursor delta.
     */
    delta: number;
    /**
     * Previous active history item.
     */
    from: BrowserNavigatorHistoryItem<State>;
    /**
     * Currently active history item.
     */
    to: BrowserNavigatorHistoryItem<State>;
  };
}

export interface BrowserNavigatorFormatHistoryItemResult<State> {
  id?: string;
  pathname: string;
  params: {
    hash: string;
    search: string;
    state?: State;
  };
}
