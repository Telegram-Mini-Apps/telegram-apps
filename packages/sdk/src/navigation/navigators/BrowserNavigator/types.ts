import type { BrowserNavigator } from '@/navigation/navigators/BrowserNavigator/BrowserNavigator.js';
import type { PartialBy } from '@/types/index.js';

export interface BrowserNavigatorEntry<State> {
  id: string;
  pathname: string;
  search?: string;
  hash?: string;
  state?: State;
}

export interface BrowserNavigatorEntryParams<State> {
  search?: string;
  hash?: string;
  state?: State;
}

export type BrowserNavigatorConEntry<State> = string | PartialBy<BrowserNavigatorEntry<State>, 'id'>;

export type BrowserNavigatorAnyEntry<State> = string | Partial<BrowserNavigatorEntry<State>>;

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
export interface BrowserNavigatorEvents<Params> {
  change: {
    /**
     * Navigator instance.
     */
    navigator: BrowserNavigator<Params>
    /**
     * Navigator cursor delta.
     */
    delta: number;
    /**
     * Previous active navigation entry.
     */
    from: BrowserNavigatorEntry<Params>;
    /**
     * Currently active navigation entry.
     */
    to: BrowserNavigatorEntry<Params>
  };
}
