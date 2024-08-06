import type { PostEvent } from '@telegram-apps/bridge';

export interface HistoryItem<Params> {
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

export type AnyHistoryItem<Params> = string | PartialBy<HistoryItem<Params>, 'id'>;
