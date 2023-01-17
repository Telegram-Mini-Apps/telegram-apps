/**
 * Information about events supported by Viewport.
 */
interface ViewportEventsMap {
  /**
   * Height changed.
   * @param height - current height.
   */
  heightChanged: (height: number) => void;

  /**
   * Width changed.
   * @param width - current width.
   */
  widthChanged: (width: number) => void;

  /**
   * Stable height changed.
   * @param stableHeight - current stable height.
   */
  stableHeightChanged: (stableHeight: number) => void;

  /**
   * Expansion status changed.
   * @param isExpanded - current expansion status.
   */
  expansionChanged: (isExpanded: boolean) => void;
}

/**
 * Known Viewport event name.
 */
type ViewportEventName = keyof ViewportEventsMap;

/**
 * Listener for specified Viewport event.
 */
type ViewportEventListener<E extends ViewportEventName> = ViewportEventsMap[E];

export {ViewportEventName, ViewportEventsMap, ViewportEventListener};