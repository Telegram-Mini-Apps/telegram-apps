import {ThemeParamsEventsMap} from './events';
import {isColorDark, RGBColor, toRGB, EventEmitter} from 'twa-core';
import {
  extractThemeFromJson,
  ThemeParams as TwaThemeParams,
} from 'twa-theme-params';
import {
  BridgeEventListener,
  init,
  ThemeChangedPayload,
} from 'twa-bridge';

/**
 * Contains information about currently used theme by application.
 * @see https://core.telegram.org/bots/webapps#themeparams
 */
export class ThemeParams {
  /**
   * Creates new ThemeParams instance from passed JSON object or its string
   * representation.
   * @param json - JSON object representation of theme parameters.
   */
  static fromJson(json: unknown): ThemeParams {
    return new ThemeParams(extractThemeFromJson(json));
  }

  /**
   * Requests fresh information about current theme information.
   * @param bridge - bridge instance.
   */
  static request(bridge = init()): Promise<ThemeChangedPayload> {
    return new Promise(res => {
      const listener: BridgeEventListener<'theme_changed'> = payload => {
        // Remove previously bound listener.
        bridge.off('theme_changed', listener);

        // Resolve result.
        res(payload);
      }

      // Add listener which will resolve promise in case, theme information
      // was received.
      bridge.on('theme_changed', listener);

      // Emit event to receive theme information.
      bridge.postEvent('web_app_request_theme');
    });
  }

  private readonly ee = new EventEmitter<ThemeParamsEventsMap>();
  private _backgroundColor: RGBColor | null = null;
  private _buttonColor: RGBColor | null = null;
  private _buttonTextColor: RGBColor | null = null;
  private _hintColor: RGBColor | null = null;
  private _linkColor: RGBColor | null = null;
  private _secondaryBackgroundColor: RGBColor | null = null;
  private _textColor: RGBColor | null = null;

  constructor(params: TwaThemeParams = {}) {
    this.assignThemeParams(params);
  }

  /**
   * Extracts required theme parameters passed from Telegram and stores them
   * in current instance. Returns true in case, some changes were done.
   * @param params - Telegram theme parameters.
   * @private
   */
  private assignThemeParams(params: TwaThemeParams): boolean {
    // Iterate over all colors and assign to current theme instance.
    const colors: (keyof TwaThemeParams)[] = [
      'buttonColor', 'buttonTextColor', 'linkColor', 'textColor', 'hintColor',
      'secondaryBackgroundColor', 'backgroundColor',
    ];
    // Flag which means, some changes were done.
    let updated = false;

    colors.forEach(color => {
      let value = params[color];

      // We skip undefined values.
      if (value === undefined) {
        return;
      }

      // In case, value is defined, we should transform it to RGB.
      try {
        // Convert value to RGB.
        value = toRGB(value);
      } catch (e) {
        throw new TypeError(`Unable to convert color "${color} to RGB."`, {cause: e});
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

    return updated;
  }

  /**
   * Background color in the `#RRGGBB` format.
   */
  get backgroundColor(): RGBColor | null {
    return this._backgroundColor;
  }

  /**
   * Button color in the `#RRGGBB` format.
   */
  get buttonColor(): RGBColor | null {
    return this._buttonColor;
  }

  /**
   * Button text color in the `#RRGGBB` format.
   */
  get buttonTextColor(): RGBColor | null {
    return this._buttonTextColor;
  }

  /**
   * Hint text color in the `#RRGGBB` format.
   */
  get hintColor(): RGBColor | null {
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
   * Link color in the `#RRGGBB` format.
   */
  get linkColor(): RGBColor | null {
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
   * Secondary background color in the `#RRGGBB` format.
   * @since Web App version 6.1+
   */
  get secondaryBackgroundColor(): RGBColor | null {
    return this._secondaryBackgroundColor;
  }

  /**
   * Main text color in the `#RRGGBB` format.
   */
  get textColor(): RGBColor | null {
    return this._textColor;
  }

  /**
   * Updates current instance via passed payload. Normally, you should not use
   * this function in your code.
   *
   * @param params - update payload.
   * @internal
   */
  update(params: TwaThemeParams) {
    const updated = this.assignThemeParams(params);

    if (updated) {
      this.ee.emit('change');
    }
  }
}
