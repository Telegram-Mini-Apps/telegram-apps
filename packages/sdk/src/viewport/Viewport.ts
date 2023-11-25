import {
  on,
  type PostEvent,
  postEvent as defaultPostEvent,
  request,
  type RequestOptions,
} from '~/bridge/index.js';
import { EventEmitter } from '~/event-emitter/index.js';
import { State } from '~/state/index.js';

import type {
  ViewportEvents,
  ViewportProps,
  ViewportState,
} from './types.js';

export interface RequestViewportResult {
  height: number;
  isStateStable: boolean;
  isExpanded: boolean;
  width: number;
}

/**
 * Formats value to make it stay in bounds [0, +Inf).
 * @param value - value to format.
 */
function truncate(value: number): number {
  return value < 0 ? 0 : value;
}

/**
 * Contains information about current WebApp device viewport, its dimensions
 * and state.
 */
export class Viewport {
  /**
   * Requests fresh information about current viewport.
   * @param options - method options.
   */
  static async request(
    { timeout = 1000, ...rest }: RequestOptions = {},
  ): Promise<RequestViewportResult> {
    const {
      is_expanded: isExpanded,
      is_state_stable: isStateStable,
      ...restViewport
    } = await request('web_app_request_viewport', 'viewport_changed', {
      ...rest,
      timeout,
    });

    return {
      ...restViewport,
      isExpanded,
      isStateStable,
    };
  }

  /**
   * Returns initialized instance of Viewport which is synchronized with
   * its actual state in Mini Apps.
   * @param options - method options.
   */
  static async synced(options: RequestOptions = {}): Promise<Viewport> {
    const { height, isExpanded, width } = await this.request(options);
    const viewport = new Viewport(
      height,
      width,
      height,
      isExpanded,
      options.postEvent,
    );
    viewport.sync();

    return viewport;
  }

  private readonly ee = new EventEmitter<ViewportEvents>();

  private readonly state: State<ViewportState>;

  private readonly postEvent: PostEvent;

  constructor(props: ViewportProps) {
    const {
      height,
      isExpanded,
      width,
      stableHeight,
      postEvent = defaultPostEvent,
    } = props;
    this.postEvent = postEvent;
    this.state = new State({
      height: truncate(height),
      isExpanded,
      stableHeight: truncate(stableHeight),
      width: truncate(width),
    }, this.ee);
  }

  /**
   * Request viewport information from the Telegram application and updates current Viewport
   * instance.
   * @param options - options to request fresh data.
   */
  actualize(options?: RequestOptions): Promise<void> {
    return Viewport
      .request(options)
      .then(({ height, isExpanded, width, isStateStable }) => {
        this.state.set({
          height,
          width,
          isExpanded,
          stableHeight: isStateStable ? height : this.state.get('stableHeight'),
        });
      });
  }

  /**
   * The current height of the visible area of the Mini App.
   *
   * The application can display just the top part of the Mini App, with its
   * lower part remaining outside the screen area. From this position, the
   * user can "pull" the Mini App to its maximum height, while the bot can do
   * the same by calling `expand` method. As the position of the Mini App
   * changes, the current height value of the visible area will be updated
   * in real time.
   *
   * Please note that the refresh rate of this value is not sufficient
   * to smoothly follow the lower border of the window. It should not be
   * used to pin interface elements to the bottom of the visible area. It's
   * more appropriate to use the value of the `stableHeight`
   * field for this purpose.
   */
  get height(): number {
    return this.state.get('height');
  }

  /**
   * The height of the visible area of the Mini App in its last stable state.
   *
   * The application can display just the top part of the Mini App, with its
   * lower part remaining outside the screen area. From this position,
   * the user can "pull" the Mini App to its maximum height, while the bot can
   * do the same by calling `expand` method.
   *
   * Unlike the value of `height`, the value of `stableHeight`
   * does not change as the position of the Mini App changes with user
   * gestures or during animations. The value of `stableHeight`
   * will be updated after all gestures and animations are completed and
   * the Mini App reaches its final size.
   */
  get stableHeight(): number {
    return this.state.get('stableHeight');
  }

  /**
   * Synchronizes specified instance of Viewport with the actual value in the native
   * application. Returns function to stop synchronization.
   */
  sync() {
    return on('viewport_changed', (event) => {
      const {
        height,
        width,
        is_expanded: isExpanded,
        is_state_stable: isStateStable,
      } = event;
      const state: Partial<ViewportState> = {
        height: truncate(height),
        isExpanded,
        width: truncate(width),
      };

      if (isStateStable) {
        state.stableHeight = state.height;
      }

      this.state.set(state);
    });
  }

  /**
   * Returns true if the Mini App is expanded to the maximum available height.
   * Otherwise, if the Mini App occupies part of the screen and can be expanded
   * to the full height using `expand` method.
   * @see expand
   */
  get isExpanded(): boolean {
    return this.state.get('isExpanded');
  }

  /**
   * Current viewport width.
   */
  get width(): number {
    return this.state.get('width');
  }

  /**
   * A method that expands the Mini App to the maximum available height. To
   * find out if the Mini App is expanded to the maximum height, refer to the
   * value of the `isExpanded`.
   * @see isExpanded
   */
  expand(): void {
    this.state.set('isExpanded', true);
    this.postEvent('web_app_expand');
  }

  /**
   * Returns true in case current viewport height is stable and is not going to
   * change in the next moment.
   */
  get isStable(): boolean {
    return this.stableHeight === this.height;
  }

  /**
   * Adds new event listener.
   */
  on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off = this.ee.off.bind(this.ee);
}
