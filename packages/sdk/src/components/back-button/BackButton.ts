import type { PostEvent } from '@/bridge/methods/postEvent.js';
import { WithStateAndSupports } from '@/classes/with-state-and-supports/WithStateAndSupports.js';
import type { Version } from '@/version/types.js';

import type { BackButtonState } from './types.js';

/**
 * @see Usage: https://docs.telegram-mini-apps.com/platform/back-button
 * @see API: https://docs.telegram-mini-apps.com/packages/tma-js-sdk/components/back-button
 */
export class BackButton extends WithStateAndSupports<BackButtonState, 'show' | 'hide'> {
  constructor(isVisible: boolean, version: Version, private readonly postEvent: PostEvent) {
    super({ isVisible }, version, {
      show: 'web_app_setup_back_button',
      hide: 'web_app_setup_back_button',
    });
  }

  private set isVisible(visible: boolean) {
    this.set('isVisible', visible);
    this.postEvent('web_app_setup_back_button', { is_visible: visible });
  }

  /**
   * True if BackButton is currently visible.
   */
  get isVisible(): boolean {
    return this.get('isVisible');
  }

  /**
   * Hides the BackButton.
   */
  hide(): void {
    this.isVisible = false;
  }

  /**
   * Shows the BackButton.
   */
  show(): void {
    this.isVisible = true;
  }
}
