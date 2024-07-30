import { postEvent } from '@/globals/globals.js';
import { decorateWithSupports, type WithSupports } from '@/components/decorateWithSupports.js';
import type {
  ImpactHapticFeedbackStyle,
  NotificationHapticFeedbackType,
} from '@/bridge/methods/types/index.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/haptic-feedback
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/haptic-feedback
 */


const MINI_APPS_METHOD = 'web_app_trigger_haptic_feedback';

/**
 * A method tells that an impact occurred. The Telegram app may play the appropriate haptics based
 * on style value passed.
 * @param style - impact style.
 */
export const impactOccurred: WithSupports<(style: ImpactHapticFeedbackStyle) => void> =
  decorateWithSupports(style => {
    postEvent()(MINI_APPS_METHOD, {
      type: 'impact',
      impact_style: style,
    });
  }, MINI_APPS_METHOD);

/**
 * A method tells that a task or action has succeeded, failed, or produced a warning. The Telegram
 * app may play the appropriate haptics based on type value passed.
 * @param type - notification type.
 */
export const notificationOccurred: WithSupports<(type: NotificationHapticFeedbackType) => void> =
  decorateWithSupports(type => {
    postEvent()(MINI_APPS_METHOD, {
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
export const selectionChanged: WithSupports<() => void> = decorateWithSupports(() => {
  postEvent()(MINI_APPS_METHOD, { type: 'selection_change' });
}, MINI_APPS_METHOD);
