import type { BasicNavigator } from '@/navigation/navigators/BasicNavigator/BasicNavigator.js';
import type { PartialBy } from '@/types/index.js';

/**
 * Navigation entry used by the `BasicNavigator`.
 */
export interface BasicNavigatorEntry<Params> {
  id: string;
  pathname: string;
  params?: Params;
}

/**
 * Navigation entry used by the `BasicNavigator` constructor.
 */
export type BasicNavigatorConEntry<Params> = string | PartialBy<BasicNavigatorEntry<Params>, 'id'>;

/**
 * Navigation entry description, used by the `BasicNavigator` methods.
 */
export type BasicNavigatorAnyEntry<Params> = string | Partial<BasicNavigatorEntry<Params>>;

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
     * Previous active navigation entry.
     */
    from: BasicNavigatorEntry<Params>;
    /**
     * Currently active navigation entry.
     */
    to: BasicNavigatorEntry<Params>
  };
}
