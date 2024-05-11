import type { BasicNavigator } from '@/navigation/BasicNavigator/BasicNavigator.js';

/**
 * History item used by the `BasicNavigator`.
 */
export interface BasicNavigatorHistoryItem<Params> {
  id: string;
  pathname: string;
  params?: Params;
}

/**
 * History item used by the `BasicNavigator` methods.
 */
export type BasicNavigatorAnyHistoryItem<Params> =
  | string
  | Partial<BasicNavigatorHistoryItem<Params>>;

/**
 * Events supported by `BasicNavigator`.
 */
export interface BasicNavigatorEvents<Params> {
  change: {
    /**
     * Navigator instance.
     */
    navigator: BasicNavigator<Params>
    /**
     * Navigator cursor delta.
     */
    delta: number;
    /**
     * Previous active history item.
     */
    from: BasicNavigatorHistoryItem<Params>;
    /**
     * Currently active history item.
     */
    to: BasicNavigatorHistoryItem<Params>
  };
}
