import { EventEmitter } from '@tma.js/event-emitter';
import { parse, type ThemeParams as ThemeParamsType } from '@tma.js/theme-params';
import { on, request, type RequestOptions } from '@tma.js/bridge';
import { isColorDark } from '@tma.js/colors';

import type { RGB } from '@tma.js/colors';

import { State } from '../../state/index.js';

import type { ThemeParamsEvents, ThemeParamsState } from './types.js';

/**
 * Contains information about currently used theme by application.
 * @see https://core.telegram.org/bots/webapps#themeparams
 */
export class ThemeParams {
  /**
   * Requests fresh information about current theme.
   * FIXME: Be careful using this function in desktop version of Telegram as
   *  long as method web_app_request_theme does not work on `macos` platform.
   * @param options - method options.
   */
  static async request(options: RequestOptions = {}): Promise<ThemeParamsType> {
    const { timeout = 1000, ...restOptions } = options;
    const result = await request('web_app_request_theme', 'theme_changed', {
      ...restOptions,
      timeout,
    });

    return parse(result.theme_params);
  }

  /**
   * Synchronizes specified instance of ThemeParams with the actual value in the native
   * application.
   * @param themeParams - ThemeParams instance.
   */
  static sync(themeParams: ThemeParams): void {
    on('theme_changed', (event) => {
      themeParams.state.set(parse(event.theme_params));
    });
  }

  /**
   * Returns instance of ThemeParams which is synchronized with external
   * environment.
   * @param options - method options.
   */
  static async synced(options?: RequestOptions): Promise<ThemeParams> {
    const params = await this.request(options);
    const tp = new ThemeParams(params);

    this.sync(tp);

    return tp;
  }

  private readonly ee = new EventEmitter<ThemeParamsEvents>();

  private readonly state: State<ThemeParamsState>;

  constructor(params: ThemeParamsType) {
    this.state = new State(params, this.ee);
  }

  get accentTextColor(): RGB | null {
    return this.get('accentTextColor');
  }

  /**
   * Returns background color.
   */
  get backgroundColor(): RGB | null {
    return this.get('backgroundColor');
  }

  /**
   * Returns button color.
   */
  get buttonColor(): RGB | null {
    return this.get('buttonColor');
  }

  /**
   * Returns button text color.
   */
  get buttonTextColor(): RGB | null {
    return this.get('buttonTextColor');
  }

  get destructiveTextColor(): RGB | null {
    return this.get('destructiveTextColor');
  }

  /**
   * Retrieves palette color value by its name.
   * @param key - palette key name.
   */
  get(key: keyof ThemeParamsType): RGB | null {
    return this.state.get(key) || null;
  }

  getState(): ThemeParamsType {
    return this.state.getState();
  }

  get headerBackgroundColor(): RGB | null {
    return this.get('headerBackgroundColor');
  }

  /**
   * Returns hint color.
   */
  get hintColor(): RGB | null {
    return this.get('hintColor');
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
  get secondaryBackgroundColor(): RGB | null {
    return this.get('secondaryBackgroundColor');
  }

  get sectionBackgroundColor(): RGB | null {
    return this.get('sectionBackgroundColor');
  }

  get sectionHeaderTextColor(): RGB | null {
    return this.get('sectionHeaderTextColor');
  }

  get subtitleTextColor(): RGB | null {
    return this.get('subtitleTextColor');
  }

  /**
   * Returns text color.
   */
  get textColor(): RGB | null {
    return this.get('textColor');
  }
}
