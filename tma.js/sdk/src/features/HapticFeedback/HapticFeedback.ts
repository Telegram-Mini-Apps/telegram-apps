import type { Computed } from '@tma.js/signals';
import type {
  ImpactHapticFeedbackStyle,
  NotificationHapticFeedbackType,
} from '@tma.js/bridge';

import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { WithVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { createWrapSafeFp, type SafeWrappedFp, type SafeWrapped } from '@/wrappers/wrap-safe-fp.js';
import { unwrapFp } from '@/wrappers/unwrapFp.js';

export interface HapticFeedbackOptions extends WithVersionBasedPostEvent, SharedFeatureOptions {
}

/**
 * @since Mini Apps v6.1
 */
export class HapticFeedback {
  constructor({ postEvent, isTma, version }: HapticFeedbackOptions) {
    const HAPTIC_METHOD_NAME = 'web_app_trigger_haptic_feedback';
    const wrapSupported = createWrapSafeFp({
      isSupported: HAPTIC_METHOD_NAME,
      isTma,
      version,
      returns: 'plain',
    });

    this.isSupported = createIsSupportedSignal(HAPTIC_METHOD_NAME, version);
    this.impactOccurredFp = wrapSupported(style => {
      postEvent(HAPTIC_METHOD_NAME, { type: 'impact', impact_style: style });
    });
    this.notificationOccurredFp = wrapSupported(type => {
      postEvent(HAPTIC_METHOD_NAME, { type: 'notification', notification_type: type });
    });
    this.selectionChangedFp = wrapSupported(() => {
      postEvent(HAPTIC_METHOD_NAME, { type: 'selection_change' });
    });

    this.impactOccurred = unwrapFp(this.impactOccurredFp);
    this.notificationOccurred = unwrapFp(this.notificationOccurredFp);
    this.selectionChanged = unwrapFp(this.selectionChangedFp);
  }

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  /**
   * A method that tells if an impact occurred. The Telegram app may play the
   * appropriate haptics based on style value passed.
   * @param style - impact style.
   * @since Mini Apps v6.1
   */
  impactOccurredFp: SafeWrappedFp<(style: ImpactHapticFeedbackStyle) => void, true>;

  /**
   * @see impactOccurredFp
   */
  impactOccurred: SafeWrapped<(style: ImpactHapticFeedbackStyle) => void, true>;

  /**
   * A method tells that a task or action has succeeded, failed, or produced
   * a warning. The Telegram app may play the appropriate haptics based on type
   * value passed.
   * @param type - notification type.
   * @since Mini Apps v6.1
   */
  notificationOccurredFp: SafeWrappedFp<(type: NotificationHapticFeedbackType) => void, true>;

  /**
   * @see notificationOccurredFp
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
  selectionChangedFp: SafeWrappedFp<() => void, true>;

  /**
   * @see selectionChangedFp
   */
  selectionChanged: SafeWrapped<() => void, true>;
}
