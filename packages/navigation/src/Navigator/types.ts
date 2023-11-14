export interface NavigationEntry {
  pathname: string;
  search: string;
  hash: string;
}

export type NavigatorConEntry = Partial<NavigationEntry>;

/**
 * Entry information is allowed to be used in `push` and `replace` Navigator methods.
 * Should be either path or object partially describing it.
 */
export type AnyEntry = string | Partial<NavigationEntry>;

export type PerformGoOptions =
  | {
  updated: false;
  delta: number;
}
  | {
  updated: true;
  delta: number;
  before: NavigationEntry;
  after: NavigationEntry;
};

export interface PerformPushOptions {
  before: NavigationEntry;
  after: NavigationEntry;
}

export type PerformReplaceOptions =
  | {
  updated: false;
  entry: NavigationEntry;
}
  | {
  updated: true;
  before: NavigationEntry;
  after: NavigationEntry;
};

export interface NavigatorOptions {
  /**
   * Should navigator display debug messages.
   * @default false
   */
  debug?: boolean;

  /**
   * Prefix used for logger.
   * @default 'Navigator'
   */
  loggerPrefix?: string;
}
