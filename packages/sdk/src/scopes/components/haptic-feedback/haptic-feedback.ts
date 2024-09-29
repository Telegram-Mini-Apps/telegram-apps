import {
  supports,
  type ImpactHapticFeedbackStyle,
  type NotificationHapticFeedbackType,
} from '@telegram-apps/bridge';

import { $version, postEvent } from '@/scopes/globals.js';

const MINI_APPS_METHOD = 'web_app_trigger_haptic_feedback';

/**
 * A method tells that an impact occurred. The Telegram app may play the appropriate haptics based
 * on style value passed.
 * @param style - impact style.
 */
export function impactOccurred(style: ImpactHapticFeedbackStyle): void {
  postEvent(MINI_APPS_METHOD, { type: 'impact', impact_style: style });
}

/**
 * @returns True if the haptic feedback is supported.
 */
export function isSupported(): boolean {
  return supports(MINI_APPS_METHOD, $version());
}

/**
 * A method tells that a task or action has succeeded, failed, or produced a warning. The Telegram
 * app may play the appropriate haptics based on type value passed.
 * @param type - notification type.
 */
export function notificationOccurred(type: NotificationHapticFeedbackType): void {
  postEvent(MINI_APPS_METHOD, { type: 'notification', notification_type: type });
}

/**
 * A method tells that the user has changed a selection. The Telegram app may play the
 * appropriate haptics.
 *
 * Do not use this feedback when the user makes or confirms a selection; use it only when the
 * selection changes.
 */
export function selectionChanged(): void {
  postEvent(MINI_APPS_METHOD, { type: 'selection_change' });
}
