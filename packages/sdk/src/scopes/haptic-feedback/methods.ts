import type {
  ImpactHapticFeedbackStyle,
  NotificationHapticFeedbackType,
} from '@telegram-apps/bridge';

import { $postEvent } from '@/scopes/globals/globals.js';
import { withIsSupported } from '@/scopes/withIsSupported.js';

const MINI_APPS_METHOD = 'web_app_trigger_haptic_feedback';

/**
 * A method tells that an impact occurred. The Telegram app may play the appropriate haptics based
 * on style value passed.
 * @param style - impact style.
 */
export const impactOccurred = withIsSupported((style: ImpactHapticFeedbackStyle): void => {
  $postEvent()(MINI_APPS_METHOD, {
    type: 'impact',
    impact_style: style,
  });
}, MINI_APPS_METHOD);

/**
 * A method tells that a task or action has succeeded, failed, or produced a warning. The Telegram
 * app may play the appropriate haptics based on type value passed.
 * @param type - notification type.
 */
export const notificationOccurred = withIsSupported((type: NotificationHapticFeedbackType): void => {
  $postEvent()(MINI_APPS_METHOD, {
    type: 'notification',
    notification_type: type,
  });
}, MINI_APPS_METHOD);

/**
 * A method tells that the user has changed a selection. The Telegram app may play the
 * appropriate haptics.
 *
 * Do not use this feedback when the user makes or confirms a selection; use it only when the
 * selection changes.
 */
export const selectionChanged = withIsSupported(() => {
  $postEvent()(MINI_APPS_METHOD, { type: 'selection_change' });
}, MINI_APPS_METHOD);
