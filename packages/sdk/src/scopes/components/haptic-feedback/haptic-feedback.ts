import type {
  ImpactHapticFeedbackStyle,
  NotificationHapticFeedbackType,
} from '@telegram-apps/bridge';

import { postEvent } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import {
  createWrapSafeSupported
} from '@/scopes/toolkit/createWrapSafeSupported.js';

const WEB_APP_TRIGGER_HAPTIC_FEEDBACK = 'web_app_trigger_haptic_feedback';
const wrapSupport = createWrapSafeSupported('hapticFeedback', WEB_APP_TRIGGER_HAPTIC_FEEDBACK);

/**
 * @returns True if the Haptic Feedback component is supported.
 */
export const isSupported = createIsSupported(WEB_APP_TRIGGER_HAPTIC_FEEDBACK);

/**
 * A method tells that an impact occurred. The Telegram app may play the
 * appropriate haptics based on style value passed.
 * @param style - impact style.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (impactOccurred.isAvailable()) {
 *   impactOccurred('medium');
 * }
 */
export const impactOccurred = wrapSupport(
  'impactOccurred',
  (style: ImpactHapticFeedbackStyle): void => {
    postEvent(WEB_APP_TRIGGER_HAPTIC_FEEDBACK, {
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
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (notificationOccurred.isAvailable()) {
 *   notificationOccurred('success');
 * }
 */
export const notificationOccurred = wrapSupport(
  'notificationOccurred',
  (type: NotificationHapticFeedbackType): void => {
    postEvent(WEB_APP_TRIGGER_HAPTIC_FEEDBACK, {
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
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (selectionChanged.isAvailable()) {
 *   selectionChanged();
 * }
 */
export const selectionChanged = wrapSupport(
  'selectionChanged',
  (): void => {
    postEvent(WEB_APP_TRIGGER_HAPTIC_FEEDBACK, { type: 'selection_change' });
  },
);
