import {RGB} from '@twa.js/utils';

/**
 * Information about MainButton supported events.
 */
export interface MainButtonEventsMap {
  /**
   * Main button was clicked.
   */
  click: () => void;

  /**
   * Background color changed.
   * @param color - current state.
   */
  colorChanged: (color: RGB) => void;

  /**
   * Progress visibility changed.
   * @param isVisible - current state.
   */
  isProgressVisibleChanged: (isVisible: boolean) => void;

  /**
   * Active status changed.
   * @param isEnabled - current state.
   */
  isEnabledChanged: (isEnabled: boolean) => void;

  /**
   * Visibility changed.
   * @param isVisible - current main button visibility state.
   */
  isVisibleChanged: (isVisible: boolean) => void;

  /**
   * Text changed.
   * @param text - current main button text.
   */
  textChanged: (text: string) => void;

  /**
   * Text color changed.
   * @param color - current main button text color.
   */
  textColorChanged: (color: RGB) => void;
}

/**
 * Known MainButton event name.
 */
export type MainButtonEventName = keyof MainButtonEventsMap;

/**
 * Listener for specified MainButton event.
 */
export type MainButtonEventListener<E extends MainButtonEventName> = MainButtonEventsMap[E];
