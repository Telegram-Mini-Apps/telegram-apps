export interface BackButtonEvents {
  click: () => void;
  isVisibleChanged: (value: boolean) => void;
}

export type BackButtonEventName = keyof BackButtonEvents;

export type BackButtonEventListener<E extends BackButtonEventName> =
  BackButtonEvents[E];
