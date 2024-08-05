import type { PostEvent } from '@telegram-apps/bridge';

/**
 * History item used by the navigator.
 */
export interface NavigatorHistoryItem<Params> {
  /**
   * Unique history item identifier.
   */
  id: string;
  /**
   * History item pathname. Used to determine the item location.
   */
  pathname: string;
  /**
   * Additional history item parameters.
   */
  params?: Params;
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type AnyNavigatorHistoryItem<Params> =
  | string
  | PartialBy<NavigatorHistoryItem<Params>, 'id'>;

export interface NavigatorConOptions {
  /**
   * Function to call Mini Apps methods.
   * @default The `postEvent` function from @telegram-apps/bridge.
   */
  postEvent?: PostEvent;
  /**
   * Custom behavior on the back button press.
   *
   * Note that this method will only be called in case the navigator was attached via
   * the `attach()` method.
   * @default The navigator will call its `back()` method.
   */
  onBackButtonPressed?(this: void): void;
}