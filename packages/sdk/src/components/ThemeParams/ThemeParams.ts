import { type RGB, EventEmitter } from '@twa.js/utils';
import { type BridgeEventListener } from '@twa.js/bridge';

import type { ThemeParamsEventsMap } from './events';
import type { BridgeLike } from '../../types';
import {
  isColorDark,
  parseThemeParams,
  type ThemeParams as TwaThemeParams,
} from '../../utils';

/**
 * Contains information about currently used theme by application.
 * @see https://core.telegram.org/bots/webapps#themeparams
 */
export class ThemeParams {
  /**
   * Requests fresh information about current theme.
   * @param bridge - bridge instance.
   */
  static request(bridge: BridgeLike): Promise<TwaThemeParams> {
    // Emit event to receive theme information.
    bridge.postEvent('web_app_request_theme');

    return new Promise((res) => {
      const listener: BridgeEventListener<'theme_changed'> = (payload) => {
        // Remove previously bound listener.
        bridge.off('theme_changed', listener);

        // Resolve result.
        res(parseThemeParams(payload.theme_params));
      };

      // Add listener which will resolve promise in case, theme information
      // was received.
      bridge.on('theme_changed', listener);
    });
  }

  /**
   * Returns instance of ThemeParams which is synchronized with external
   * environment.
   * @param bridge - bridge instance.
   * @param params - theme parameters.
   */
  static synced(bridge: BridgeLike, params: TwaThemeParams): ThemeParams {
    const tp = new ThemeParams(params);

    bridge.on('theme_changed', (event) => {
      tp.assignThemeParams(parseThemeParams(event.theme_params), true);
    });

    return tp;
  }

  private readonly ee = new EventEmitter<ThemeParamsEventsMap>();

  private params: TwaThemeParams;

  constructor(params: TwaThemeParams) {
    this.params = params;
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
      this.params[color] = value;
      updated = true;
    });

    if (updated && emit) {
      this.ee.emit('change');
    }
  }

  /**
   * Returns background color.
   */
  get backgroundColor(): RGB {
    return this.params.backgroundColor;
  }

  /**
   * Returns button color.
   */
  get buttonColor(): RGB {
    return this.params.buttonColor;
  }

  /**
   * Returns button text color.
   */
  get buttonTextColor(): RGB {
    return this.params.buttonTextColor;
  }

  /**
   * Returns hint color.
   */
  get hintColor(): RGB {
    return this.params.hintColor;
  }

  /**
   * Returns true in case, current color scheme is recognized as dark. This
   * value is calculated according to theme background color.
   */
  get isDark(): boolean {
    const bgColor = this.backgroundColor;

    return bgColor === null || isColorDark(bgColor);
  }

  /**
   * Returns current link color.
   */
  get linkColor(): RGB {
    return this.params.linkColor;
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
   * Returns secondary background color.
   * @since Web App version 6.1+
   */
  get secondaryBackgroundColor(): RGB | null {
    return this.params.secondaryBackgroundColor || null;
  }

  /**
   * Returns text color.
   */
  get textColor(): RGB {
    return this.params.textColor;
  }
}
