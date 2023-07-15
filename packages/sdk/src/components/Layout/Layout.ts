import { EventEmitter, type RGB, type Version } from '@twa.js/utils';
import type { HeaderColorKey } from '@twa.js/bridge';

import type { LayoutEventsMap } from './events.js';
import type { BridgeLike, ColorScheme } from '../../types.js';
import { createSupportsFunc, isColorDark, type SupportsFunc } from '../../utils/index.js';

/**
 * Class which provides information about current Web App layout.
 */
export class Layout {
  private readonly ee = new EventEmitter<LayoutEventsMap>();

  #backgroundColor: RGB;

  #headerColor: HeaderColorKey;

  constructor(
    private readonly bridge: BridgeLike,
    version: Version,
    headerColor: HeaderColorKey,
    backgroundColor: RGB,
  ) {
    this.#backgroundColor = backgroundColor;
    this.#headerColor = headerColor;
    this.supports = createSupportsFunc(version, {
      setHeaderColor: 'web_app_set_header_color',
      setBackgroundColor: 'web_app_set_background_color',
    });
  }

  /**
   * Returns current Telegram application background color.
   */
  get backgroundColor(): RGB {
    return this.#backgroundColor;
  }

  /**
   * Returns current application color scheme. This value is computed according
   * to current background color.
   */
  get colorScheme(): ColorScheme {
    return isColorDark(this.backgroundColor) ? 'dark' : 'light';
  }

  /**
   * Returns current Telegram application header color key.
   */
  get headerColor(): HeaderColorKey {
    return this.#headerColor;
  }

  /**
   * Adds new event listener.
   */
  on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off = this.ee.off.bind(this.ee);

  /**
   * Returns true in case, specified method is supported by current component
   * including Web Apps platform version.
   */
  supports: SupportsFunc<'setBackgroundColor' | 'setHeaderColor'>;

  /**
   * Updates current application background color.
   * FIXME: Has no effect on desktop, works incorrectly in Android.
   *  Issues:
   *  https://github.com/Telegram-Web-Apps/twa.js/issues/9
   *  https://github.com/Telegram-Web-Apps/twa.js/issues/8
   * @param color - new color.
   */
  setBackgroundColor(color: RGB): void {
    // Notify native application about updating current background color.
    this.bridge.postEvent('web_app_set_background_color', { color });

    // Don't do anything in case, color is the same.
    if (this.#backgroundColor === color) {
      return;
    }

    // Override current background color key.
    this.#backgroundColor = color;

    // Emit event.
    this.ee.emit('backgroundColorChanged', color);
  }

  /**
   * Updates current application header color.
   * FIXME: Has no effect on desktop, works incorrectly on Android.
   *  Issues:
   *  https://github.com/Telegram-Web-Apps/twa.js/issues/9
   *  https://github.com/Telegram-Web-Apps/twa.js/issues/8
   * @param color - settable color key.
   */
  setHeaderColor(color: HeaderColorKey): void {
    // Notify native application about updating current header color.
    this.bridge.postEvent('web_app_set_header_color', { color_key: color });

    // Don't do anything in case, color is the same.
    if (this.#headerColor === color) {
      return;
    }

    // Override current header color key.
    this.#headerColor = color;

    // Emit event.
    this.ee.emit('headerColorChanged', color);
  }
}
