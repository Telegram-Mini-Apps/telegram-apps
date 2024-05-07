import { off } from '@/bridge/events/listening/off.js';
import { on } from '@/bridge/events/listening/on.js';
import { WithSupportsAndStateUtils } from '@/classes/WithSupportsAndStateUtils.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type {
  SettingsButtonEvents,
  SettingsButtonState,
} from '@/components/SettingsButton/types.js';
import type { EventEmitter } from '@/events/event-emitter/EventEmitter.js';
import type { Version } from '@/version/types.js';

type Emitter = EventEmitter<SettingsButtonEvents>;

export class SettingsButton extends WithSupportsAndStateUtils<SettingsButtonState, 'show' | 'hide'> {
  constructor(isVisible: boolean, version: Version, private readonly postEvent: PostEvent) {
    super({ isVisible }, version, {
      show: 'web_app_setup_settings_button',
      hide: 'web_app_setup_settings_button',
    });
  }

  private set isVisible(visible: boolean) {
    this.set('isVisible', visible);
    this.postEvent('web_app_setup_settings_button', { is_visible: visible });
  }

  /**
   * True if the SettingsButton is visible.
   */
  get isVisible(): boolean {
    return this.get('isVisible');
  }

  /**
   * Hides the SettingsButton.
   */
  hide(): void {
    this.isVisible = false;
  }

  /**
   * Adds a new event listener.
   * @param event - event to listen.
   * @param listener - listener to add.
   */
  on: Emitter['on'] = (event, listener) => (
    event === 'click'
      ? on('settings_button_pressed', listener)
      : this.state.on(event, listener as any)
  );

  /**
   * Removes the event listener.
   * @param event - event to listen.
   * @param listener - listener to remove.
   */
  off: Emitter['off'] = (event, listener) => (
    event === 'click'
      ? off('settings_button_pressed', listener)
      : this.state.off(event, listener as any)
  );

  /**
   * Shows the SettingsButton.
   */
  show(): void {
    this.isVisible = true;
  }
}
