import type { Version } from '@twa.js/utils';
import {
  postEvent as bridgePostEvent,
  type PostEvent,
  type ImpactHapticFeedbackStyle,
  type NotificationHapticFeedbackType,
} from '@twa.js/bridge';

import { WithSupports } from '../../lib/index.js';

/**
 * Class which controls haptic feedback. It allows calling different types of
 * haptic notifications which usually occur after user interaction with
 * application.
 */
export class HapticFeedback
  extends WithSupports<'impactOccurred' | 'notificationOccurred' | 'selectionChanged'> {
  readonly #postEvent: PostEvent;

  constructor(version: Version, postEvent: PostEvent = bridgePostEvent) {
    super(version, {
      impactOccurred: 'web_app_trigger_haptic_feedback',
      notificationOccurred: 'web_app_trigger_haptic_feedback',
      selectionChanged: 'web_app_trigger_haptic_feedback',
    });
    this.#postEvent = postEvent;
  }

  /**
   * A method tells that an impact occurred. The Telegram app may play the
   * appropriate haptics based on style value passed.
   * @param style - impact style.
   */
  impactOccurred(style: ImpactHapticFeedbackStyle): void {
    this.#postEvent('web_app_trigger_haptic_feedback', {
      type: 'impact',
      impact_style: style,
    });
  }

  /**
   * A method tells that a task or action has succeeded, failed, or produced
   * a warning. The Telegram app may play the appropriate haptics based on
   * type value passed.
   * @param type - notification type.
   */
  notificationOccurred(type: NotificationHapticFeedbackType): void {
    this.#postEvent('web_app_trigger_haptic_feedback', {
      type: 'notification',
      notification_type: type,
    });
  }

  /**
   * A method tells that the user has changed a selection. The Telegram app
   * may play the appropriate haptics.
   *
   * Do not use this feedback when the user makes or confirms a selection;
   * use it only when the selection changes.
   */
  selectionChanged(): void {
    this.#postEvent('web_app_trigger_haptic_feedback', {
      type: 'selection_change',
    });
  }
}
