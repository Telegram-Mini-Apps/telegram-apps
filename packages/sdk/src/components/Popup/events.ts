export interface PopupEvents {
  isOpenedChanged: (isOpened: boolean) => void;
}

export type PopupEventName = keyof PopupEvents;

export type PopupEventListener<E extends PopupEventName> = PopupEvents[E];
