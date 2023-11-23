import {
  on,
  request,
  type RequestOptions,
} from '~/bridge/index.js';
import {
  isColorDark,
  type RGB,
} from '~/colors/index.js';
import { EventEmitter } from '~/event-emitter/index.js';
import { State } from '~/state/index.js';

import { parseThemeParams } from './parseThemeParams.js';
import { serializeThemeParams } from './serializeThemeParams.js';
import type {
  ThemeParamsEvents,
  ThemeParamsParsed,
  ThemeParamsState,
} from './types.js';

/**
 * Application [theme parameters](https://docs.telegram-mini-apps.com/platform/functionality/theming).
 * Defines palette used by the Telegram application.
 */
export class ThemeParams {
  /**
   * Requests fresh information about current theme from the Telegram application.
   * @param options - method options.
   */
  static request({ timeout = 1000, ...rest }: RequestOptions = {}): Promise<ThemeParamsParsed> {
    return request('web_app_request_theme', 'theme_changed', {
      ...rest,
      timeout,
    }).then(parseThemeParams);
  }

  /**
   * Returns instance of ThemeParams which is synchronized with external
   * environment.
   * @param options - method options.
   */
  static async synced(options?: RequestOptions): Promise<ThemeParams> {
    const params = await this.request(options);
    const tp = new ThemeParams(params);
    tp.sync();

    return tp;
  }

  private readonly ee = new EventEmitter<ThemeParamsEvents>();

  private readonly state: State<ThemeParamsState>;

  constructor(params: ThemeParamsParsed) {
    this.state = new State(params, this.ee);
  }

  /**
   * @since v6.10
   */
  get accentTextColor(): RGB | undefined {
    return this.get('accentTextColor');
  }

  /**
   * Returns background color.
   */
  get backgroundColor(): RGB | undefined {
    return this.get('backgroundColor');
  }

  /**
   * Returns button color.
   */
  get buttonColor(): RGB | undefined {
    return this.get('buttonColor');
  }

  /**
   * Returns button text color.
   */
  get buttonTextColor(): RGB | undefined {
    return this.get('buttonTextColor');
  }

  /**
   * @since v6.10
   */
  get destructiveTextColor(): RGB | undefined {
    return this.get('destructiveTextColor');
  }

  /**
   * Retrieves palette color value by its name.
   * @param key - palette key name.
   */
  get(key: keyof ThemeParamsParsed): RGB | undefined {
    return this.state.get(key);
  }

  getState(): ThemeParamsParsed {
    return this.state.clone();
  }

  /**
   * @since v6.10
   */
  get headerBackgroundColor(): RGB | undefined {
    return this.get('headerBackgroundColor');
  }

  /**
   * Returns hint color.
   */
  get hintColor(): RGB | undefined {
    return this.get('hintColor');
  }

  /**
   * Returns true in case, current color scheme is recognized as dark. This
   * value is calculated according to theme background color.
   */
  get isDark(): boolean {
    return !this.backgroundColor || isColorDark(this.backgroundColor);
  }

  /**
   * Returns current link color.
   */
  get linkColor(): RGB | undefined {
    return this.get('linkColor');
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
   */
  get secondaryBackgroundColor(): RGB | undefined {
    return this.get('secondaryBackgroundColor');
  }

  /**
   * @since v6.10
   */
  get sectionBackgroundColor(): RGB | undefined {
    return this.get('sectionBackgroundColor');
  }

  /**
   * @since v6.10
   */
  get sectionHeaderTextColor(): RGB | undefined {
    return this.get('sectionHeaderTextColor');
  }

  /**
   * Serializes theme parameters to representation sent from the Telegram application.
   */
  serialize(): string {
    return serializeThemeParams(this.getState());
  }

  /**
   * Synchronizes current instance with the Telegram application. Returns handler to remove
   * event listener.
   */
  sync() {
    return on('theme_changed', (event) => {
      this.state.set(parseThemeParams(event.theme_params));
    });
  }

  /**
   * @since v6.10
   */
  get subtitleTextColor(): RGB | undefined {
    return this.get('subtitleTextColor');
  }

  /**
   * Returns text color.
   */
  get textColor(): RGB | undefined {
    return this.get('textColor');
  }
}
