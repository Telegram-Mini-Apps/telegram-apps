import type { HashNavigator } from './HashNavigator.js';
import type { NavigationEntry, NavigatorOptions } from '../Navigator/types.js';

export type HashNavigatorOptions = Omit<NavigatorOptions, 'loggerPrefix'>;

interface ChangeEventPayload {
  /**
   * Navigator instance.
   */
  navigator: HashNavigator;

  /**
   * Previous navigation state.
   */
  from: NavigationEntry;

  /**
   * Current navigation state.
   */
  to: NavigationEntry;
}

export interface HashNavigatorEventsMap {
  /**
   * Being called whenever current history changes.
   * @param event - generated event.
   */
  change: (event: ChangeEventPayload) => void;
}

/**
 * Navigator event name.
 */
export type HashNavigatorEventName = keyof HashNavigatorEventsMap;

/**
 * Navigator event listener.
 */
export type HashNavigatorEventListener<E extends HashNavigatorEventName> =
  HashNavigatorEventsMap[E];
