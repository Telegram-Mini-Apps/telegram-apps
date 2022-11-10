import {RGBColor} from 'twa-core';

interface PropertyEventsMap {
  /**
   * Being emitted when main button changes its active state.
   * @param isActive - current main button active state.
   */
  activeChange: (isActive: boolean) => void;

  /**
   * Being emitted when main button changes its color.
   * @param color - current main button color.
   */
  colorChange: (color: RGBColor) => void;

  /**
   * Being emitted when main button changes its progress visibility.
   * @param isVisible - current main button progress visibility state.
   */
  progressVisibleChange: (isVisible: boolean) => void;

  /**
   * Being emitted when main button changes its text.
   * @param text - current main button text.
   */
  textChange: (text: string) => void;

  /**
   * Being emitted when main button changes its color.
   * @param color - current main button text color.
   */
  textColorChange: (color: RGBColor) => void;

  /**
   * Being emitted when main button changes its visibility.
   * @param isVisible - current main button visibility state.
   */
  visibleChange: (isVisible: boolean) => void;
}

/**
 * List of events supported for listening by MainButton.
 */
export interface MainButtonEventsMap extends PropertyEventsMap {
  /**
   * Being emitted when user pressed main button.
   */
  click: () => void;
}

/**
 * Known MainButton event name.
 */
export type MainButtonEventName = keyof MainButtonEventsMap;

/**
 * Returns listener for specified MainButton event.
 */
export type MainButtonEventListener<E extends MainButtonEventName> =
  MainButtonEventsMap[E];
