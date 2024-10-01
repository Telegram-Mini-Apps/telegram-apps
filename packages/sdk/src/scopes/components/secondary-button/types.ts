import type { RGB } from '@telegram-apps/bridge';

export interface State {
  /**
   * The Secondary Button background color.
   */
  backgroundColor: RGB;
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
   * The Secondary Button text.
   */
  text: string;
  /**
   * The Secondary Button text color.
   */
  textColor: RGB;
}