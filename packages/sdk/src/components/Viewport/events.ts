export interface ViewportEventsMap {
  heightChanged: (height: number) => void;
  isExpandedChanged: (isExpanded: boolean) => void;
  stableHeightChanged: (stableHeight: number) => void;
  widthChanged: (width: number) => void;
}

export type ViewportEventName = keyof ViewportEventsMap;

export type ViewportEventListener<E extends ViewportEventName> =
  ViewportEventsMap[E];
