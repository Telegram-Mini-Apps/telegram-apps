import {isColorDark, RGB, EventEmitter} from 'twa-core';
import {
  extractThemeFromJson,
  ThemeParams as TwaThemeParams,
} from 'twa-theme-params';
import {BridgeEventListener} from 'twa-bridge';

import {ThemeParamsEventsMap} from './events';
import {BridgeLike} from '../../types';

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

    return new Promise(res => {
      const listener: BridgeEventListener<'theme_changed'> = payload => {
        // Remove previously bound listener.
        bridge.off('theme_changed', listener);

        // Resolve result.
        res(extractThemeFromJson(payload));
      };

      // Add listener which will resolve promise in case, theme information
      // was received.
      bridge.on('theme_changed', listener);
    });
  }

  /**
   * Returns instance of ThemeParams which is synchronized with external
   * environment
   * @param bridge - bridge instance.
   * @param params - theme parameters.
   */
  static synced(bridge: BridgeLike, params: TwaThemeParams): ThemeParams {
    const tp = new ThemeParams(params);

    bridge.on('theme_changed', params => {
      tp.assignThemeParams(extractThemeFromJson(params), true);
    });

    return tp;
  }

  private readonly ee = new EventEmitter<ThemeParamsEventsMap>();
  private _backgroundColor: RGB | null = null;
  private _buttonColor: RGB | null = null;
  private _buttonTextColor: RGB | null = null;
  private _hintColor: RGB | null = null;
  private _linkColor: RGB | null = null;
  private _secondaryBackgroundColor: RGB | null = null;
  private _textColor: RGB | null = null;

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

    colors.forEach(color => {
      const value = params[color];

      // We skip undefined values.
      if (value === undefined) {
        return;
      }

      const prop = '_' + color as `_${typeof color}`;

      // No changes will be done, leave iteration.
      if (this[prop] === value) {
        return;
      }
      // Reassign current theme color.
      this[prop] = value;
      updated = true;
    });

    if (updated && emit) {
      this.ee.emit('change');
    }
  }

  /**
   * Returns background color.
   */
  get backgroundColor(): RGB | null {
    return this._backgroundColor;
  }

  /**
   * Returns button color.
   */
  get buttonColor(): RGB | null {
    return this._buttonColor;
  }

  /**
   * Returns button text color.
   */
  get buttonTextColor(): RGB | null {
    return this._buttonTextColor;
  }

  /**
   * Returns hint color.
   */
  get hintColor(): RGB | null {
    return this._hintColor;
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
  get linkColor(): RGB | null {
    return this._linkColor;
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
    return this._secondaryBackgroundColor;
  }

  /**
   * Returns text color.
   */
  get textColor(): RGB | null {
    return this._textColor;
  }
}
