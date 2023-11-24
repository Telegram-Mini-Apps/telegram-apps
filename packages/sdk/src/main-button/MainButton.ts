import {
  off,
  on,
  type PostEvent,
  postEvent as defaultPostEvent,
} from '~/bridge/index.js';
import { EventEmitter } from '~/event-emitter/index.js';
import { State } from '~/state/index.js';
import type { RGB } from '~/colors/index.js';

import type {
  MainButtonEvents,
  MainButtonProps,
  MainButtonState,
} from './types.js';

type Emitter = EventEmitter<MainButtonEvents>;

/**
 * Controls the main button, which is displayed at the bottom
 * of the Mini App in the Telegram interface.
 */
export class MainButton {
  private readonly ee: Emitter = new EventEmitter();

  private readonly state: State<MainButtonState>;

  private readonly postEvent: PostEvent;

  constructor(props: MainButtonProps) {
    const {
      postEvent = defaultPostEvent,
      text,
      textColor,
      backgroundColor,
      isEnabled,
      isVisible,
      isProgressVisible,
    } = props;

    this.postEvent = postEvent;
    this.state = new State({
      backgroundColor,
      isEnabled,
      isVisible,
      isProgressVisible,
      text,
      textColor,
    }, this.ee);
  }

  private set isEnabled(value: boolean) {
    this.state.set('isEnabled', value);
    this.commit();
  }

  /**
   * Returns true in case, MainButton is currently enabled.
   */
  get isEnabled(): boolean {
    return this.state.get('isEnabled');
  }

  private set isProgressVisible(value: boolean) {
    this.state.set('isProgressVisible', value);
    this.commit();
  }

  /**
   * Returns true in case, MainButton loading progress is currently visible.
   */
  get isProgressVisible(): boolean {
    return this.state.get('isProgressVisible');
  }

  private set isVisible(value: boolean) {
    this.state.set('isVisible', value);
    this.commit();
  }

  /**
   * Returns true in case, MainButton is currently visible.
   */
  get isVisible(): boolean {
    return this.state.get('isVisible');
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

    this.postEvent('web_app_setup_main_button', {
      is_visible: this.isVisible,
      is_active: this.isEnabled,
      is_progress_visible: this.isProgressVisible,
      text: this.text,
      color: this.backgroundColor,
      text_color: this.textColor,
    });
  }

  // TODO: set params

  /**
   * Returns current main button background color.
   */
  get backgroundColor(): RGB {
    return this.state.get('backgroundColor');
  }

  /**
   * Returns current main button text.
   */
  get text(): string {
    return this.state.get('text');
  }

  /**
   * Returns current main button text color.
   */
  get textColor(): RGB {
    return this.state.get('textColor');
  }

  /**
   * Disables button. Returns current button instance for chaining.
   */
  disable(): this {
    // FIXME: This method does not work on Android. Event "main_button_pressed"
    //  keeps getting received even in case, button is disabled.
    //  Issue: https://github.com/Telegram-Mini-Apps/documentation/issues/1
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
   *  Issue: https://github.com/Telegram-Mini-Apps/tma.js/issues/3
   * @param event - event name.
   * @param listener - event listener.
   */
  on: Emitter['on'] = (event, listener) => (
    event === 'click'
      ? on('main_button_pressed', listener)
      : this.ee.on(event, listener)
  );

  /**
   * Removes event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  off: Emitter['off'] = (event, listener) => (
    event === 'click'
      ? off('main_button_pressed', listener)
      : this.ee.off(event, listener)
  );

  /**
   * Shows the button. Note that opening the Mini App from the attachment
   * menu hides the main button until the user interacts with the Mini App
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
    this.state.set('text', value);
    this.commit();

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
    this.state.set('textColor', value);
    this.commit();

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
    this.state.set('backgroundColor', value);
    this.commit();

    return this;
  }
}
