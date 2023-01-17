import {RGB} from '@twa.js/utils';

/**
 * Information about MainButton supported events.
 */
interface MainButtonEventsMap {
  /**
   * Active status changed.
   * @param isActive - current state.
   */
  activeChanged: (isActive: boolean) => void;

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
  progressVisibleChanged: (isVisible: boolean) => void;

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

  /**
   * Visibility changed.
   * @param isVisible - current main button visibility state.
   */
  visibleChanged: (isVisible: boolean) => void;
}

/**
 * Known MainButton event name.
 */
type MainButtonEventName = keyof MainButtonEventsMap;

/**
 * Listener for specified MainButton event.
 */
type MainButtonEventListener<E extends MainButtonEventName> = MainButtonEventsMap[E];

export {MainButtonEventListener, MainButtonEventName, MainButtonEventsMap};
