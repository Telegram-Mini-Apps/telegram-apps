import {RGB} from 'twa-core';
import {HeaderColorKey} from 'twa-bridge';

/**
 * Information about Layout supported events.
 */
export interface LayoutEventsMap {
  /**
   * Background color changed.
   * @param color - current background color.
   */
  backgroundColorChanged: (color: RGB) => void;

  /**
   * Header color changed.
   * @param color - current color key.
   */
  headerColorChanged: (color: HeaderColorKey) => void;
}

/**
 * Known Layout event name.
 */
export type LayoutEventName = keyof LayoutEventsMap;

/**
 * Listener for specified Layout event.
 */
export type LayoutEventListener<E extends LayoutEventName> =
  LayoutEventsMap[E];
