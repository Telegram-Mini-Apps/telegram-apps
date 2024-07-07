import { WithTrackableState } from '@/classes/WithTrackableState.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { SwipeBehaviorState } from '@/components/SwipeBehavior/types.js';

/**
 * @see Usage: https://docs.telegram-mini-apps.com/platform/swipe-behavior
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/swipe-behavior
 */
export class SwipeBehavior extends WithTrackableState<SwipeBehaviorState> {
  constructor(isVerticalSwipesEnabled: boolean, private readonly postEvent: PostEvent) {
    super({ isVerticalSwipesEnabled });
  }

  private set isVerticalSwipesEnabled(value: boolean) {
    this.set('isVerticalSwipesEnabled', value);
    this.postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: value });
  }

  /**
   * True, if vertical swipes to close or minimize the Mini App are enabled.
   * False, if vertical swipes to close or minimize the Mini App are disabled.
   * In any case, the user will still be able to minimize and close the Mini App by swiping the Mini App's header.
   */
  get isVerticalSwipesEnabled(): boolean {
    return this.get('isVerticalSwipesEnabled');
  }

  /**
   * Disables vertical swipes to close or minimize the Mini App.
   */
  disableVerticalSwipes(): void {
    this.isVerticalSwipesEnabled = false;
  }

  /**
   * Enables vertical swipes to close or minimize the Mini App.
   */
  enableVerticalSwipes(): void {
    this.isVerticalSwipesEnabled = true;
  }
}
