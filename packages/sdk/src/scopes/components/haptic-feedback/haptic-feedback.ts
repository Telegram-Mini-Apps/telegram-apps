import type {
  ImpactHapticFeedbackStyle,
  NotificationHapticFeedbackType,
} from '@telegram-apps/bridge';

import { postEvent } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';

const HAPTIC_METHOD_NAME = 'web_app_trigger_haptic_feedback';
const wrapSupported = createWrapSupported('hapticFeedback', HAPTIC_METHOD_NAME);

/**
 * Signal indicating if the Haptic Feedback is supported.
 */
export const isSupported = createIsSupported(HAPTIC_METHOD_NAME);

/**
 * A method that tells if an impact occurred. The Telegram app may play the
 * appropriate haptics based on style value passed.
 * @param style - impact style.
 * @since Mini Apps v6.1
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (impactOccurred.isAvailable()) {
 *   impactOccurred('medium');
 * }
 */
export const impactOccurred = wrapSupported(
  'impactOccurred',
  (style: ImpactHapticFeedbackStyle): void => {
    postEvent(HAPTIC_METHOD_NAME, {
      type: 'impact',
      impact_style: style,
    });
  },
);

/**
 * A method tells that a task or action has succeeded, failed, or produced
 * a warning. The Telegram app may play the appropriate haptics based on type
 * value passed.
 * @param type - notification type.
 * @since Mini Apps v6.1
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (notificationOccurred.isAvailable()) {
 *   notificationOccurred('success');
 * }
 */
export const notificationOccurred = wrapSupported(
  'notificationOccurred',
  (type: NotificationHapticFeedbackType): void => {
    postEvent(HAPTIC_METHOD_NAME, {
      type: 'notification',
      notification_type: type,
    });
  },
);

/**
 * A method tells that the user has changed a selection. The Telegram app may
 * play the appropriate haptics.
 *
 * Do not use this feedback when the user makes or confirms a selection; use
 * it only when the selection changes.
 * @since Mini Apps v6.1
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (selectionChanged.isAvailable()) {
 *   selectionChanged();
 * }
 */
export const selectionChanged = wrapSupported(
  'selectionChanged',
  (): void => {
    postEvent(HAPTIC_METHOD_NAME, { type: 'selection_change' });
  },
);
