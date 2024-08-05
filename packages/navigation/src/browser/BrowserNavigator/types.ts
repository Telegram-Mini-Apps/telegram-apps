import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { BrowserNavigator } from '@/browser/BrowserNavigator/BrowserNavigator.js';

export interface BrowserNavigatorConOptions {
  /**
   * Base navigator URL.
   * @default ""
   */
  base?: string;
  /**
   * Hash navigation mode. Pass null to enable MPA (Multi Page Application) navigation.
   * @default 'classic'
   */
  hashMode?: BrowserNavigatorHashMode | null;
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
 * @example 'classic'
 * '#pathname?search'
 * @example 'slash'
 * '#/pathname?search'
 */
export type BrowserNavigatorHashMode = 'classic' | 'slash';

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
