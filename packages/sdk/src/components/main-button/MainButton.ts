import type {
  MainButtonEvents,
  MainButtonParams,
  MainButtonProps,
  MainButtonState,
} from './types.js';
import { off } from '../../bridge/events/off.js';
import { on } from '../../bridge/events/on.js';
import type { PostEvent } from '../../bridge/methods/postEvent.js';
import { postEvent as defaultPostEvent } from '../../bridge/methods/postEvent.js';
import type { RGB } from '../../colors/types.js';
import { EventEmitter } from '../../event-emitter/EventEmitter.js';
import { State } from '../../state/State.js';

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
      isLoaderVisible,
    } = props;

    this.postEvent = postEvent;
    this.state = new State({
      backgroundColor,
      isEnabled,
      isVisible,
      isLoaderVisible,
      text,
      textColor,
    }, this.ee);
  }

  /**
   * Sends current local state to Telegram application.
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
      is_progress_visible: this.isLoaderVisible,
      text: this.text,
      color: this.backgroundColor,
      text_color: this.textColor,
    });
  }

  private set isEnabled(isEnabled: boolean) {
    this.setParams({ isEnabled });
  }

  /**
   * True if the Main Button is currently enabled.
   */
  get isEnabled(): boolean {
    return this.state.get('isEnabled');
  }

  private set isLoaderVisible(isLoaderVisible: boolean) {
    this.setParams({ isLoaderVisible });
  }

  /**
   * True if the Main Button loader is currently visible.
   */
  get isLoaderVisible(): boolean {
    return this.state.get('isLoaderVisible');
  }

  private set isVisible(isVisible: boolean) {
    this.setParams({ isVisible });
  }

  /**
   * True if the Main Button is currently visible.
   */
  get isVisible(): boolean {
    return this.state.get('isVisible');
  }

  /**
   * The Main Button background color.
   */
  get backgroundColor(): RGB {
    return this.state.get('backgroundColor');
  }

  /**
   * The Main Button text.
   */
  get text(): string {
    return this.state.get('text');
  }

  /**
   * The Main Button text color.
   */
  get textColor(): RGB {
    return this.state.get('textColor');
  }

  /**
   * Disables the Main Button.
   */
  disable(): this {
    // FIXME: This method does not work on Android. Event "main_button_pressed"
    //  keeps getting received even in case, button is disabled.
    //  Issue: https://github.com/Telegram-Mini-Apps/documentation/issues/1
    this.isEnabled = false;
    return this;
  }

  /**
   * Enables the Main Button.
   */
  enable(): this {
    this.isEnabled = true;
    return this;
  }

  /**
   * Hides the Main Button.
   */
  hide(): this {
    this.isVisible = false;
    return this;
  }

  /**
   * Hides the Main Button loader.
   */
  hideLoader(): this {
    this.isLoaderVisible = false;
    return this;
  }

  /**
   * Adds new event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  on: Emitter['on'] = (event, listener) => (
    // FIXME: Event 'main_button_pressed' is still being received on Android
    //  even if the main button is disabled.
    //  Issue: https://github.com/Telegram-Mini-Apps/tma.js/issues/3
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
   * Shows the Main Button. Note that opening the Mini App from the attachment menu hides the
   * main button until the user interacts with the Mini App interface.
   */
  show(): this {
    this.isVisible = true;
    return this;
  }

  /**
   * A method to show a loading indicator on the Main Button. It is recommended to display
   * loader if the action tied to the button may take a long time.
   */
  showLoader(): this {
    this.isLoaderVisible = true;
    return this;
  }

  /**
   * Sets new Main Button text. Minimal length for text is 1 symbol, and maximum is 64 symbols.
   * @param text - new text.
   */
  setText(text: string): this {
    return this.setParams({ text });
  }

  /**
   * Sets new Main Button text color.
   * @param textColor - new text color.
   */
  setTextColor(textColor: RGB): this {
    return this.setParams({ textColor });
  }

  /**
   * Updates current Main Button color.
   * @param backgroundColor - color to set.
   */
  setBackgroundColor(backgroundColor: RGB): this {
    return this.setParams({ backgroundColor });
  }

  /**
   * Allows setting multiple Main Button parameters.
   * @param params - Main Button parameters.
   */
  setParams(params: MainButtonParams): this {
    this.state.set(params);
    this.commit();
    return this;
  }
}
