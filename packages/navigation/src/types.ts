export type Pathname = `/${string}`;

export interface HistoryEntry {
  pathname: Pathname;
  search: string;
}

/**
 * Browser history state which associates with navigator state.
 */
export interface HistoryCurrentState {
  cursor: number;
  history: HistoryEntry[];
}

export interface NavigatorOptions {
  /**
   * Should navigator display debug messages.
   * @default false
   */
  debug?: boolean;
}

export interface NavigatorEventsMap {
  /**
   * Being called whenever current history changes.
   * @param event - occurred event.
   */
  change: (event: HistoryEntry) => void;
}
