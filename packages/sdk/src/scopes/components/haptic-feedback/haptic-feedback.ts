import type {
  ImpactHapticFeedbackStyle,
  NotificationHapticFeedbackType,
} from '@telegram-apps/bridge';

import { postEvent } from '@/scopes/globals.js';
import { createWithIsSupported } from '@/scopes/toolkit/createWithIsSupported.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';

const WEB_APP_TRIGGER_HAPTIC_FEEDBACK = 'web_app_trigger_haptic_feedback';

/**
 * @returns True if the Haptic Feedback is supported.
 */
export const isSupported = createIsSupported(WEB_APP_TRIGGER_HAPTIC_FEEDBACK);

const withIsSupported = createWithIsSupported(isSupported);

/**
 * A method tells that an impact occurred. The Telegram app may play the appropriate haptics based
 * on style value passed.
 * @param style - impact style.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const impactOccurred = withIsSupported((style: ImpactHapticFeedbackStyle): void => {
  postEvent(WEB_APP_TRIGGER_HAPTIC_FEEDBACK, { type: 'impact', impact_style: style });
});

/**
 * A method tells that a task or action has succeeded, failed, or produced a warning. The Telegram
 * app may play the appropriate haptics based on type value passed.
 * @param type - notification type.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const notificationOccurred = withIsSupported((type: NotificationHapticFeedbackType): void => {
  postEvent(WEB_APP_TRIGGER_HAPTIC_FEEDBACK, { type: 'notification', notification_type: type });
});

/**
 * A method tells that the user has changed a selection. The Telegram app may play the
 * appropriate haptics.
 *
 * Do not use this feedback when the user makes or confirms a selection; use it only when the
 * selection changes.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const selectionChanged = withIsSupported((): void => {
  postEvent(WEB_APP_TRIGGER_HAPTIC_FEEDBACK, { type: 'selection_change' });
});
