import type { SettingsButtonEvents, SettingsButtonState } from './types.js';
import { off } from '../../bridge/events/off.js';
import { on } from '../../bridge/events/on.js';
import type { PostEvent } from '../../bridge/methods/postEvent.js';
import { postEvent as defaultPostEvent } from '../../bridge/methods/postEvent.js';
import { EventEmitter } from '../../event-emitter/EventEmitter.js';
import { State } from '../../state/State.js';
import { createSupportsFunc } from '../../supports/createSupportsFunc.js';
import type { SupportsFunc } from '../../supports/types.js';
import type { Version } from '../../version/types.js';

type Emitter = EventEmitter<SettingsButtonEvents>;

export class SettingsButton {
  private readonly ee: Emitter = new EventEmitter();

  private readonly state: State<SettingsButtonState>;

  constructor(
    isVisible: boolean,
    version: Version,
    private readonly postEvent: PostEvent = defaultPostEvent,
  ) {
    this.state = new State({ isVisible }, this.ee);
    this.supports = createSupportsFunc(version, {
      show: 'web_app_setup_settings_button',
      hide: 'web_app_setup_settings_button',
    });
  }

  private set isVisible(visible: boolean) {
    this.state.set('isVisible', visible);
    this.postEvent('web_app_setup_settings_button', { is_visible: visible });
  }

  /**
   * True if SettingsButton is currently visible.
   */
  get isVisible(): boolean {
    return this.state.get('isVisible');
  }

  /**
   * Hides the SettingsButton.
   */
  hide(): void {
    this.isVisible = false;
  }

  /**
   * Adds event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  on: Emitter['on'] = (event, listener) => (
    event === 'click'
      ? on('settings_button_pressed', listener)
      : this.ee.on(event, listener)
  );

  /**
   * Removes event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  off: Emitter['off'] = (event, listener) => (
    event === 'click'
      ? off('settings_button_pressed', listener)
      : this.ee.off(event, listener)
  );

  /**
   * Shows the SettingsButton.
   */
  show(): void {
    this.isVisible = true;
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<'show' | 'hide'>;
}
