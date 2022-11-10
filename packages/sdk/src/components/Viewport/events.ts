/**
 * List of events, supported for listening by Viewport.
 */
export interface ViewportEventsMap {
  /**
   * Being emitted when viewport height changed.
   * @param height - new height.
   */
  heightChange: (height: number) => void;

  /**
   * Being emitted when viewport width changed.
   * @param width - new width.
   */
  widthChange: (width: number) => void;

  /**
   * Being emitted when viewport stable height changed.
   * @param height - new stable height.
   */
  stableHeightChange: (stableHeight: number) => void;

  /**
   * Being emitted when viewport expansion status changed.
   * @param isExpanded - new expansion status.
   */
  expansionChange: (isExpanded: boolean) => void;
}

/**
 * Known Viewport event name.
 */
export type ViewportEventName = keyof ViewportEventsMap;
