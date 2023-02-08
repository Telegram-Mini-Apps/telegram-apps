import {
  ImpactHapticFeedbackStyle,
  NotificationHapticFeedbackType,
} from '@twa.js/bridge';
import {Version} from '@twa.js/utils';

import {createSupportsFunc, SupportsFunc} from '../../utils';
import {BridgeLike} from '../../types';

/**
 * Class which controls haptic feedback. It allows calling different types of
 * haptic notifications which usually occur after user interaction with
 * application.
 */
export class HapticFeedback {
  constructor(private readonly bridge: BridgeLike, version: Version) {
    this.supports = createSupportsFunc(version, {
      impactOccurred: 'web_app_trigger_haptic_feedback',
      notificationOccurred: 'web_app_trigger_haptic_feedback',
      selectionChanged: 'web_app_trigger_haptic_feedback',
    });
  }

  /**
   * A method tells that an impact occurred. The Telegram app may play the
   * appropriate haptics based on style value passed.
   * @param style - impact style.
   */
  impactOccurred(style: ImpactHapticFeedbackStyle): void {
    this.bridge.postEvent('web_app_trigger_haptic_feedback', {
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
    this.bridge.postEvent('web_app_trigger_haptic_feedback', {
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
    this.bridge.postEvent('web_app_trigger_haptic_feedback', {
      type: 'selection_change',
    });
  }

  /**
   * Returns true in case, specified method is supported by current component
   * including Web Apps platform version.
   */
  supports: SupportsFunc<'impactOccurred' | 'notificationOccurred' | 'selectionChanged'>;
}
