import {EventEmitter, RGB} from '@twa.js/utils';

import {MainButtonEventListener, MainButtonEventsMap} from './events';
import {BridgeLike} from '../../types';

type Emitter = EventEmitter<MainButtonEventsMap>;

interface MainButtonProps {
  /**
   * Should changes be automatically sent to Telegram native application.
   * @default true
   */
  autocommit?: boolean;
}

/**
 * Controls the main button, which is displayed at the bottom
 * of the Web App in the Telegram interface.
 *
 * TODO: Desktop animation is rather bad in case, we call progress visibility
 *  right after click. It is not smooth.
 */
class MainButton {
  private readonly ee: Emitter = new EventEmitter();
  private _isActive = false;
  private _isVisible = false;
  private _isProgressVisible = false;
  private _text = '';

  constructor(
    private readonly bridge: BridgeLike,
    private _color: RGB,
    private _textColor: RGB,
    props: MainButtonProps = {},
  ) {
    const {autocommit = true} = props;
    this.autocommit = autocommit;
  }

  /**
   * Flag which is responsible for automatic commit of changes to native
   * application in case, they were done.
   */
  autocommit: boolean;

  private set color(value: RGB) {
    const prev = this._color;
    this._color = value;

    if (this.autocommit) {
      this.commit();
    }
    if (this._color !== prev) {
      this.ee.emit('colorChanged', this._color);
    }
  }

  /**
   * Returns current main button background color.
   */
  get color(): RGB {
    return this._color;
  }

  private set isActive(value: boolean) {
    const prev = this._isActive;
    this._isActive = value;

    if (this.autocommit) {
      this.commit();
    }
    if (this._isActive !== prev) {
      this.ee.emit('activeChanged', this._isActive);
    }
  }

  /**
   * Returns true in case, main button is currently enabled.
   */
  get isActive(): boolean {
    return this._isActive;
  }

  private set isProgressVisible(value: boolean) {
    const prev = this._isProgressVisible;
    this._isProgressVisible = value;

    if (this.autocommit) {
      this.commit();
    }
    if (this._isProgressVisible !== prev) {
      this.ee.emit('progressVisibleChanged', this._isProgressVisible);
    }
  }

  /**
   * Returns true in case, main button loading progress is currently visible.
   */
  get isProgressVisible(): boolean {
    return this._isProgressVisible;
  }

  private set isVisible(value: boolean) {
    const prev = this._isVisible;
    this._isVisible = value;

    if (this.autocommit) {
      this.commit();
    }
    if (this._isVisible !== prev) {
      this.ee.emit('visibleChanged', this._isVisible);
    }
  }

  /**
   * Returns true in case, main button is currently visible.
   */
  get isVisible(): boolean {
    return this._isVisible;
  }

  private set text(value: string) {
    const prev = this._text;
    this._text = value;

    if (this.autocommit) {
      this.commit();
    }
    if (this._text !== prev) {
      this.ee.emit('textChanged', value);
    }
  }

  /**
   * Returns current main button text.
   */
  get text(): string {
    return this._text;
  }

  private set textColor(value: RGB) {
    const prev = this._textColor;
    this._textColor = value;

    if (this.autocommit) {
      this.commit();
    }
    if (this._textColor !== prev) {
      this.ee.emit('textColorChanged', this._textColor);
    }
  }

  /**
   * Returns current main button text color.
   */
  get textColor(): RGB {
    return this._textColor;
  }

  /**
   * Sends current local button state to native app.
   */
  commit(): void {
    // We should not commit changes until payload is correct. We could
    // have some invalid values in case, button instance could be created
    // with empty values. Otherwise, unexpected behaviour could be received.
    if (this.text === '') {
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
  on: Emitter['on'] = (event, listener) => {
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
  off: Emitter['off'] = (event, listener) => {
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
  setTextColor(color: RGB): this {
    this.textColor = color;
    return this;
  }

  /**
   * Updates current button color. Returns current button instance for
   * chaining.
   * @param color - color to set.
   */
  setColor(color: RGB): this {
    this.color = color;
    return this;
  }
}

export {MainButton, MainButtonProps};