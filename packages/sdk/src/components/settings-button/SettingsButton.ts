import type { PostEvent } from '@/bridge/methods/postEvent.js';
import { WithStateAndSupports } from '@/classes/with-state-and-supports/WithStateAndSupports.js';
import type { Version } from '@/version/types.js';

import type { SettingsButtonState } from './types.js';

export class SettingsButton extends WithStateAndSupports<SettingsButtonState, 'show' | 'hide'> {
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
   * Shows the SettingsButton.
   */
  show(): void {
    this.isVisible = true;
  }
}
