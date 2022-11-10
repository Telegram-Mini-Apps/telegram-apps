import {EventEmitter, toRGB, RGBColor} from 'twa-core';
import {MainButtonEventListener, MainButtonEventsMap} from './events';
import {Bridge} from 'twa-bridge';
import {WithCommonProps} from '../../types';
import {processBridgeProp} from '../../utils';

export interface MainButtonProps extends WithCommonProps {
  /**
   * Should changes be automatically sent to native application.
   * @default false
   */
  autocommit?: boolean;
  color?: RGBColor;
  isActive?: boolean;
  isVisible?: boolean;
  isProgressVisible?: boolean;
  text?: string;
  textColor?: RGBColor;
}

/**
 * Formats text before setting it.
 * @param text - text to set.
 * @private
 */
function formatText(text: string): string {
  text = text.trim();

  if (text.length === 0 || text.length > 64) {
    throw new Error(`Text has incorrect length: ${text.length}`);
  }
  return text;
}

/**
 * Controls the main button, which is displayed at the bottom
 * of the Web App in the Telegram interface.
 *
 * TODO: Desktop animation is rather bad in case, we call progress visibility
 *  right after click. It is not smooth.
 */
export class MainButton {
  /**
   * Flag which is responsible for automatic commit of changes to native
   * application in case, they were done.
   * @private
   */
  private readonly autocommit: boolean;
  private readonly bridge: Bridge
  private readonly ee = new EventEmitter<MainButtonEventsMap>();
  private _color: RGBColor;
  private _textColor: RGBColor;
  private _isActive: boolean;
  private _isVisible: boolean;
  private _isProgressVisible: boolean;
  private _text: string;

  constructor(props: MainButtonProps = {}) {
    const {
      isProgressVisible = false, isVisible = false, isActive = false,
      bridge, text, textColor, color, autocommit = false,
    } = props;
    this.autocommit = autocommit;
    this.bridge = processBridgeProp(bridge);
    this._color = color === undefined ? '' : toRGB(color);
    this._textColor = textColor === undefined ? '' : toRGB(textColor);
    this._text = text === undefined ? '' : formatText(text);
    this._isProgressVisible = isProgressVisible;
    this._isVisible = isVisible;
    this._isActive = isActive;
  }

  private set color(value: RGBColor) {
    value = toRGB(value);
    const prev = this._color;
    this._color = value;

    if (value !== prev) {
      this.ee.emit('colorChange', value);
    }
    if (this.autocommit) {
      this.commit();
    }
  }

  get color(): RGBColor {
    return this._color;
  }

  private set isActive(value: boolean) {
    const prev = this._isActive;
    this._isActive = value;

    if (value !== prev) {
      this.ee.emit('activeChange', value);
    }
    if (this.autocommit) {
      this.commit();
    }
  }

  /**
   * Shows whether the button is active.
   */
  get isActive(): boolean {
    return this._isActive;
  }

  private set isProgressVisible(value: boolean) {
    const prev = this._isProgressVisible;
    this._isProgressVisible = value;

    if (value !== prev) {
      this.ee.emit('progressVisibleChange', value);
    }
    if (this.autocommit) {
      this.commit();
    }
  }

  /**
   * Shows whether the button is displaying a loading indicator.
   */
  get isProgressVisible(): boolean {
    return this._isProgressVisible;
  }

  private set isVisible(value: boolean) {
    const prev = this._isVisible;
    this._isVisible = value;

    if (value !== prev) {
      this.ee.emit('visibleChange', value);
    }
    if (this.autocommit) {
      this.commit();
    }
  }

  /**
   * Shows whether the button is visible.
   */
  get isVisible(): boolean {
    return this._isVisible;
  }

  private set text(value: string) {
    value = formatText(value);
    const prev = this._text;
    this._text = value;

    if (value !== prev) {
      this.ee.emit('textChange', value);
    }
    if (this.autocommit) {
      this.commit();
    }
  }

  /**
   * Current button text.
   */
  get text(): string {
    return this._text;
  }

  private set textColor(value: RGBColor) {
    value = toRGB(value);
    const prev = this._textColor;
    this._textColor = value;

    if (value !== prev) {
      this.ee.emit('textColorChange', value);
    }
    if (this.autocommit) {
      this.commit();
    }
  }

  /**
   * Current button text color.
   */
  get textColor(): RGBColor {
    return this._textColor;
  }

  /**
   * Sends current local button state to native app.
   */
  commit(): void {
    // We should not commit changes until payload is correct. We could
    // have some invalid values in case, button instance could be created
    // with empty values. Otherwise, unexpected behaviour could be received.
    if (this.text === '' || this.color === '' || this.textColor === '') {
      return;
    }
    this.bridge.postEvent('web_app_setup_main_button', {
      is_visible: this.isVisible,
      is_active: this.isActive,
      is_progress_visible: this.isProgressVisible,
      text: this.text,
      color: this.color,
      text_color: this.textColor,
    });
  }

  /**
   * Disables button. Returns current button instance for chaining.
   */
  disable(): this {
    // FIXME: This method does not work on Android. Event "main_button_pressed"
    //  keeps getting received even in case, button is disabled.
    //  Issue: https://github.com/Telegram-Web-Apps/documentation/issues/1
    this.isActive = false;
    return this;
  }

  /**
   * Enables button. Returns current button instance for chaining.
   */
  enable(): this {
    this.isActive = true;
    return this;
  }

  /**
   * Hides button. Returns current button instance for chaining.
   */
  hide(): this {
    this.isVisible = false;
    return this;
  }

  /**
   * Hides button progress. Returns current button instance for chaining.
   */
  hideProgress(): this {
    this.isProgressVisible = false;
    return this;
  }

  /**
   * Adds new event listener.
   * FIXME: Event 'main_button_pressed' is still being received on Android
   *  even if the main button is disabled.
   *  Issue: https://github.com/Telegram-Web-Apps/twa/issues/3
   * @param event - event name.
   * @param listener - event listener.
   */
  on: typeof this.ee.on = (event, listener) => {
    if (event === 'click') {
      return this.bridge.on('main_button_pressed', listener as MainButtonEventListener<'click'>);
    }
    this.ee.on(event, listener);
  };

  /**
   * Removes event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  off: typeof this.ee.off = (event, listener) => {
    if (event === 'click') {
      return this.bridge.off('main_button_pressed', listener as MainButtonEventListener<'click'>);
    }
    this.ee.off(event, listener);
  };

  /**
   * Shows the button. Note that opening the Web App from the attachment
   * menu hides the main button until the user interacts with the Web App
   * interface.
   *
   * Returns current button instance for chaining.
   */
  show(): this {
    this.isVisible = true;
    return this;
  }

  /**
   * A method to show a loading indicator on the button.
   * It is recommended to display loading progress if the action tied to the
   * button may take a long time.
   *
   * Returns current button instance for chaining.
   */
  showProgress(): this {
    this.isProgressVisible = true;
    return this;
  }

  /**
   * Sets new main button text. Returns current button instance for chaining.
   * Minimal length for text is 1 symbol, and maximum is 64 symbols.
   * @param text - new text.
   */
  setText(text: string): this {
    this.text = text;
    return this;
  }

  /**
   * Sets new main button text color. Returns current button instance for
   * chaining.
   * @param color - new text color.
   */
  setTextColor(color: RGBColor): this {
    this.textColor = color;
    return this;
  }

  /**
   * Updates current button color. Returns current button instance for
   * chaining.
   * @param color - color to set.
   */
  setColor(color: RGBColor): this {
    this.color = color;
    return this;
  }
}