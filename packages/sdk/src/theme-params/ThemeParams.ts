import { parseThemeParams } from './parseThemeParams.js';
import type {
  ThemeParamsEvents,
  ThemeParamsParsed,
  ThemeParamsState,
} from './types.js';
import type { RemoveListenerFn } from '../bridge/index.js';
import { on } from '../bridge/index.js';
import { isColorDark, type RGB } from '../colors/index.js';
import { EventEmitter } from '../event-emitter/index.js';
import { State } from '../state/index.js';

type Emitter = EventEmitter<ThemeParamsEvents>;

export class ThemeParams {
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

  get backgroundColor(): RGB | undefined {
    return this.get('backgroundColor');
  }

  get buttonColor(): RGB | undefined {
    return this.get('buttonColor');
  }

  get buttonTextColor(): RGB | undefined {
    return this.get('buttonTextColor');
  }

  get destructiveTextColor(): RGB | undefined {
    return this.get('destructiveTextColor');
  }

  /**
   * Retrieves palette color value by its name.
   * @param key - palette key name.
   */
  get(key: Extract<keyof ThemeParamsParsed, string>): RGB | undefined {
    return this.state.get(key);
  }

  /**
   * Returns the copy of the internal state of the current component instance.
   */
  getState(): ThemeParamsParsed {
    return this.state.clone();
  }

  /**
   * @since v6.10
   */
  get headerBackgroundColor(): RGB | undefined {
    return this.get('headerBackgroundColor');
  }

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

  get linkColor(): RGB | undefined {
    return this.get('linkColor');
  }

  /**
   * Adds new event listener.
   */
  on: Emitter['on'] = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: Emitter['off'] = this.ee.off.bind(this.ee);

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
   * Starts listening to theme changes and applies them.
   * @returns Function to stop listening.
   */
  listen(): RemoveListenerFn {
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

  get textColor(): RGB | undefined {
    return this.get('textColor');
  }
}
