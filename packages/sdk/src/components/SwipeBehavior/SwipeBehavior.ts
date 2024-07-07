import { WithSupportsAndTrackableState } from '@/classes/WithSupportsAndTrackableState.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { SwipeBehaviorState } from '@/components/SwipeBehavior/types.js';

// TODO: Usage.

/**
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/swipe-behavior
 */
export class SwipeBehavior extends WithSupportsAndTrackableState<SwipeBehaviorState,
  | 'disableVerticalSwipe'
  | 'enableVerticalSwipe'> {
  constructor(isVerticalSwipeEnabled: boolean, version: string, private readonly postEvent: PostEvent) {
    super({ isVerticalSwipeEnabled }, version, {
      disableVerticalSwipe: 'web_app_setup_swipe_behavior',
      enableVerticalSwipe: 'web_app_setup_swipe_behavior',
    });
  }

  private set isVerticalSwipeEnabled(value: boolean) {
    this.set('isVerticalSwipeEnabled', value);
    this.postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: value });
  }

  /**
   * True, if the vertical swipe enabled.
   */
  get isVerticalSwipeEnabled(): boolean {
    return this.get('isVerticalSwipeEnabled');
  }

  /**
   * Disables the vertical swipe.
   */
  disableVerticalSwipe(): void {
    this.isVerticalSwipeEnabled = false;
  }

  /**
   * Enables the vertical swipe.
   */
  enableVerticalSwipe(): void {
    this.isVerticalSwipeEnabled = true;
  }
}
