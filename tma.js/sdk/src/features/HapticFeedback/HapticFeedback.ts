import type { Computed } from '@tma.js/signals';
import type {
  ImpactHapticFeedbackStyle,
  NotificationHapticFeedbackType,
} from '@tma.js/bridge';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import type {
  SharedComponentOptions,
  WithPostEvent,
  WithVersion,
} from '@/features/types.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';

export interface HapticFeedbackOptions extends WithPostEvent, WithVersion, SharedComponentOptions {
}

/**
 * @since Mini Apps v6.1
 */
export class HapticFeedback {
  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  constructor({ postEvent, isTma, version }: HapticFeedbackOptions) {
    const HAPTIC_METHOD_NAME = 'web_app_trigger_haptic_feedback';
    this.isSupported = createIsSupportedSignal(HAPTIC_METHOD_NAME, version);

    const wrapOptions = { isSupported: HAPTIC_METHOD_NAME, isTma, version } as const;
    const wrapSupported = createWrapSafe(wrapOptions);

    this.impactOccurred = wrapSupported(style => {
      postEvent(HAPTIC_METHOD_NAME, { type: 'impact', impact_style: style });
    });
    this.notificationOccurred = wrapSupported(type => {
      postEvent(HAPTIC_METHOD_NAME, { type: 'notification', notification_type: type });
    });
    this.selectionChanged = wrapSupported(() => {
      postEvent(HAPTIC_METHOD_NAME, { type: 'selection_change' });
    });
  }

  /**
   * A method that tells if an impact occurred. The Telegram app may play the
   * appropriate haptics based on style value passed.
   * @param style - impact style.
   * @since Mini Apps v6.1
   */
  impactOccurred: SafeWrapped<(style: ImpactHapticFeedbackStyle) => void, true>;

  /**
   * A method tells that a task or action has succeeded, failed, or produced
   * a warning. The Telegram app may play the appropriate haptics based on type
   * value passed.
   * @param type - notification type.
   * @since Mini Apps v6.1
   */
  notificationOccurred: SafeWrapped<(type: NotificationHapticFeedbackType) => void, true>;

  /**
   * A method tells that the user has changed a selection. The Telegram app may
   * play the appropriate haptics.
   *
   * Do not use this feedback when the user makes or confirms a selection; use
   * it only when the selection changes.
   * @since Mini Apps v6.1
   */
  selectionChanged: SafeWrapped<() => void, true>;
}
