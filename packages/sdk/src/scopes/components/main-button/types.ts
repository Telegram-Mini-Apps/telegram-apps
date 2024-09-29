import type { RGB } from '@telegram-apps/bridge';

export interface State {
  /**
   * The main button background color.
   */
  backgroundColor: RGB;
  /**
   * True if the main button is currently clickable.
   */
  isEnabled: boolean;
  /**
   * True if the main button loader is visible.
   */
  isLoaderVisible: boolean;
  /**
   * True if the main button is visible.
   */
  isVisible: boolean;
  /**
   * The main button text.
   */
  text: string;
  /**
   * The main button text color.
   */
  textColor: RGB;
}