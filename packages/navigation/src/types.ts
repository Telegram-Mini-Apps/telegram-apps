export interface HistoryEntry {
  pathname: string;
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

/**
 * Entry information allowed to be used in push and replace Navigator methods.
 */
export type AllowedEntry = string | {
  pathname?: string;
  search?: string;
};
