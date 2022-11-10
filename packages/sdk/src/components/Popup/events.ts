import {PopupParams} from './types';

interface PropertyEventsMap {
  /**
   * Being emitted when popup open state changes.
   * @param isOpened - current open state.
   */
  openChange: (isOpened: boolean) => void;
}

/**
 * List of events supported for listening by Popup.
 */
export interface PopupEventsMap extends PropertyEventsMap {
  /**
   * Being emitted when popup opens.
   * @param params - popup parameters.
   */
  open: (params: PopupParams) => void;

  /**
   * Being emitted when popup closes.
   * @param buttonId - button identifier. Will be null in case, user
   * pressed native app close button or clicks outside.
   */
  close: (buttonId: string | null) => void;
}

/**
 * Known MainButton event name.
 */
export type PopupEventName = keyof PopupEventsMap;