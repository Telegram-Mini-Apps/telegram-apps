import { type RGB, EventEmitter } from '@twa.js/utils';
import { on, postEvent as bridgePostEvent } from '@twa.js/bridge';

import type { ThemeParamsEvents } from './events.js';
import type { PostEvent } from '../../types.js';
import {
  isColorDark,
  themeParams,
  type ThemeParams as TwaThemeParams,
} from '../../utils/index.js';

type LocalThemeParams = {
  [K in keyof TwaThemeParams]-?: undefined extends TwaThemeParams[K]
    ? TwaThemeParams[K] | null
    : TwaThemeParams[K];
};

/**
 * Contains information about currently used theme by application.
 * @see https://core.telegram.org/bots/webapps#themeparams
 */
export class ThemeParams {
  /**
   * Requests fresh information about current theme.
   * @param postEvent - method which allows posting Telegram event.
   */
  static request(postEvent: PostEvent = bridgePostEvent): Promise<TwaThemeParams> {
    postEvent('web_app_request_theme');

    return new Promise((res) => {
      const off = on('theme_changed', ({ theme_params }) => {
        off();
        res(themeParams(theme_params));
      });
    });
  }

  /**
   * Returns instance of ThemeParams which is synchronized with external
   * environment.
   * @param postEvent - method which allows posting Telegram event.
   */
  static async synced(postEvent: PostEvent = bridgePostEvent): Promise<ThemeParams> {
    const params = await this.request(postEvent);
    const tp = new ThemeParams(params);

    on('theme_changed', (event) => {
      tp.assignThemeParams(themeParams(event.theme_params), true);
    });

    return tp;
  }

  readonly #ee = new EventEmitter<ThemeParamsEvents>();

  readonly #params: LocalThemeParams = {
    backgroundColor: null,
    linkColor: null,
    hintColor: null,
    buttonColor: null,
    buttonTextColor: null,
    textColor: null,
    secondaryBackgroundColor: null,
  };

  constructor(params: TwaThemeParams) {
    this.assignThemeParams(params, false);
  }

  /**
   * Extracts required theme parameters passed from Telegram and stores them
   * in current instance.
   * @param params - Telegram theme parameters.
   * @param emit - should update event be emitted in case changes were done.
   * @private
   */
  private assignThemeParams(params: TwaThemeParams, emit: boolean): void {
    // Iterate over all colors and assign to current theme instance.
    const colors: (keyof TwaThemeParams)[] = [
      'buttonColor', 'buttonTextColor', 'linkColor', 'textColor', 'hintColor',
      'secondaryBackgroundColor', 'backgroundColor',
    ];
    // Flag which means, some changes were done.
    let updated = false;

    colors.forEach((color) => {
      const value = params[color];

      // We skip undefined values.
      if (value === undefined) {
        return;
      }

      // No changes will be done, leave iteration.
      if (this[color] === value) {
        return;
      }
      // Reassign current theme color.
      this.#params[color] = value === undefined ? null : value;
      updated = true;
    });

    if (updated && emit) {
      this.#ee.emit('changed');
    }
  }

  /**
   * Returns background color.
   */
  get backgroundColor(): RGB | null {
    return this.#params.backgroundColor;
  }

  /**
   * Returns button color.
   */
  get buttonColor(): RGB | null {
    return this.#params.buttonColor;
  }

  /**
   * Returns button text color.
   */
  get buttonTextColor(): RGB | null {
    return this.#params.buttonTextColor;
  }

  /**
   * Returns hint color.
   */
  get hintColor(): RGB | null {
    return this.#params.hintColor;
  }

  /**
   * Returns true in case, current color scheme is recognized as dark. This
   * value is calculated according to theme background color.
   */
  get isDark(): boolean {
    return this.backgroundColor === null || isColorDark(this.backgroundColor);
  }

  /**
   * Returns current link color.
   */
  get linkColor(): RGB | null {
    return this.#params.linkColor || null;
  }

  /**
   * Adds new event listener.
   */
  on = this.#ee.on.bind(this.#ee);

  /**
   * Removes event listener.
   */
  off = this.#ee.off.bind(this.#ee);

  /**
   * Returns secondary background color.
   * @since Web App version 6.1+
   */
  get secondaryBackgroundColor(): RGB | null {
    return this.#params.secondaryBackgroundColor || null;
  }

  /**
   * Returns text color.
   */
  get textColor(): RGB | null {
    return this.#params.textColor || null;
  }
}
