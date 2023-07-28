import { EventEmitter, type RGB } from '@twa.js/utils';
import { on, off, postEvent as bridgePostEvent } from '@twa.js/bridge';

import type { MainButtonEventListener, MainButtonEvents } from './events.js';
import type { PostEvent } from '../../types.js';

type Emitter = EventEmitter<MainButtonEvents>;

/**
 * Controls the main button, which is displayed at the bottom
 * of the Web App in the Telegram interface.
 */
export class MainButton {
  readonly #ee: Emitter = new EventEmitter();

  readonly #postEvent: PostEvent;

  #backgroundColor: RGB;

  #isEnabled = false;

  #isVisible = false;

  #isProgressVisible = false;

  #text = '';

  #textColor: RGB;

  constructor(backgroundColor: RGB, textColor: RGB, postEvent: PostEvent = bridgePostEvent) {
    this.#postEvent = postEvent;
    this.#backgroundColor = backgroundColor;
    this.#textColor = textColor;
  }

  private set isEnabled(value: boolean) {
    const prev = this.#isEnabled;
    this.#isEnabled = value;
    this.commit();

    if (value !== prev) {
      this.#ee.emit('isEnabledChanged', value);
    }
  }

  /**
   * Returns true in case, MainButton is currently enabled.
   */
  get isEnabled(): boolean {
    return this.#isEnabled;
  }

  private set isProgressVisible(value: boolean) {
    const prev = this.#isProgressVisible;
    this.#isProgressVisible = value;
    this.commit();

    if (value !== prev) {
      this.#ee.emit('isProgressVisibleChanged', value);
    }
  }

  /**
   * Returns true in case, MainButton loading progress is currently visible.
   */
  get isProgressVisible(): boolean {
    return this.#isProgressVisible;
  }

  private set isVisible(value: boolean) {
    const prev = this.#isVisible;
    this.#isVisible = value;
    this.commit();

    if (value !== prev) {
      this.#ee.emit('isVisibleChanged', value);
    }
  }

  /**
   * Returns true in case, MainButton is currently visible.
   */
  get isVisible(): boolean {
    return this.#isVisible;
  }

  /**
   * Sends current local button state to Telegram application.
   */
  private commit(): void {
    // We should not commit changes until payload is correct. We could
    // have some invalid values in case, button instance was created
    // with empty values. Otherwise, an unexpected behaviour could be received.
    if (this.text === '') {
      return;
    }

    this.#postEvent('web_app_setup_main_button', {
      is_visible: this.isVisible,
      is_active: this.isEnabled,
      is_progress_visible: this.isProgressVisible,
      text: this.text,
      color: this.backgroundColor,
      text_color: this.textColor,
    });
  }

  /**
   * Returns current main button background color.
   */
  get backgroundColor(): RGB {
    return this.#backgroundColor;
  }

  /**
   * Returns current main button text.
   */
  get text(): string {
    return this.#text;
  }

  /**
   * Returns current main button text color.
   */
  get textColor(): RGB {
    return this.#textColor;
  }

  /**
   * Disables button. Returns current button instance for chaining.
   */
  disable(): this {
    // FIXME: This method does not work on Android. Event "main_button_pressed"
    //  keeps getting received even in case, button is disabled.
    //  Issue: https://github.com/Telegram-Web-Apps/documentation/issues/1
    this.isEnabled = false;
    return this;
  }

  /**
   * Enables button. Returns current button instance for chaining.
   */
  enable(): this {
    this.isEnabled = true;
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
   *  Issue: https://github.com/Telegram-Web-Apps/twa.js/issues/3
   * @param event - event name.
   * @param listener - event listener.
   */
  on: Emitter['on'] = (event, listener) => {
    if (event === 'click') {
      return on('main_button_pressed', listener as MainButtonEventListener<'click'>);
    }
    this.#ee.on(event, listener);
  };

  /**
   * Removes event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  off: Emitter['off'] = (event, listener) => {
    if (event === 'click') {
      return off('main_button_pressed', listener as MainButtonEventListener<'click'>);
    }
    this.#ee.off(event, listener);
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
   *
   * Returns current button instance for chaining.
   * @param value - new text.
   */
  setText(value: string): this {
    const prev = this.#text;
    this.#text = value;
    this.commit();

    if (prev !== value) {
      this.#ee.emit('textChanged', value);
    }

    return this;
  }

  /**
   * Sets new main button text color. Returns current button instance for
   * chaining.
   *
   * Returns current button instance for chaining.
   * @param value - new text color.
   */
  setTextColor(value: RGB): this {
    const prev = this.#textColor;
    this.#textColor = value;
    this.commit();

    if (prev !== value) {
      this.#ee.emit('textColorChanged', value);
    }

    return this;
  }

  /**
   * Updates current button color. Returns current button instance for
   * chaining.
   *
   * Returns current button instance for chaining.
   * @param value - color to set.
   */
  setBackgroundColor(value: RGB): this {
    const prev = this.#backgroundColor;
    this.#backgroundColor = value;
    this.commit();

    if (prev !== value) {
      this.#ee.emit('backgroundColorChanged', value);
    }

    return this;
  }
}
