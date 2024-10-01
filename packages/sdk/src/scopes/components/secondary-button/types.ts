import type { RGB, SecondaryButtonPosition } from '@telegram-apps/bridge';

export interface State {
  /**
   * The Secondary Button background color.
   *
   * This value may be missing in case, some specific RGB color was not yet set.
   */
  backgroundColor?: RGB;
  /**
   * True if the Secondary Button has a shining effect.
   */
  hasShineEffect: boolean;
  /**
   * True if the Secondary Button is currently clickable.
   */
  isEnabled: boolean;
  /**
   * True if the Secondary Button loader is visible.
   */
  isLoaderVisible: boolean;
  /**
   * True if the Secondary Button is visible.
   */
  isVisible: boolean;
  /**
   * The button position relative to the main one.
   */
  position: SecondaryButtonPosition;
  /**
   * The Secondary Button text.
   */
  text: string;
  /**
   * The Secondary Button text color.
   *
   * This value may be missing in case, some specific RGB color was not yet set.
   */
  textColor?: RGB;
}