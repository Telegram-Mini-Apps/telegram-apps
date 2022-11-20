import {SettableColorKey} from './types';
import {RGBColor} from 'twa-core';

/**
 * WebApp events map.
 * @see https://core.telegram.org/bots/webapps#events-available-for-web-apps
 */
export interface WebAppEventsMap {
  /**
   * Being emitted when Web App background color changes.
   * @param color - background color.
   */
  backgroundColorChange: (color: RGBColor) => void;

  /**
   * Being emitted when Web App closing confirmation status changes.
   * @param isClosingConfirmationEnabled - current closing confirmation
   * enable status.
   */
  closingConfirmationChange: (isClosingConfirmationEnabled: boolean) => void;

  /**
   * Being emitted when Web App header color changes.
   * @param color - color key.
   * @see SettableColorKey
   */
  headerColorChange: (color: SettableColorKey) => void;
}

/**
 * Known WebApp event name.
 */
export type WebAppEventName = keyof WebAppEventsMap;