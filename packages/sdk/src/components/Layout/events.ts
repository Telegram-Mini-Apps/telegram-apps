import {RGB} from '@twa.js/utils';
import {HeaderColorKey} from '@twa.js/bridge';

/**
 * Information about Layout supported events.
 */
interface LayoutEventsMap {
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
type LayoutEventName = keyof LayoutEventsMap;

/**
 * Listener for specified Layout event.
 */
type LayoutEventListener<E extends LayoutEventName> = LayoutEventsMap[E];

export {LayoutEventsMap, LayoutEventName, LayoutEventListener};