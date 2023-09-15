import { EventEmitter } from '@twa.js/event-emitter';
import { on, postEvent as defaultPostEvent, request, type RequestOptions, type PostEvent } from '@twa.js/bridge';

import { State } from '../../state/index.js';

import type { ViewportEvents, ViewportState } from './types.js';

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
   * FIXME: Be careful using this function in desktop version of Telegram as
   *  long as method web_app_request_viewport does not work on `macos` platform.
   * @see Issue: https://github.com/Telegram-Web-Apps/twa.js/issues/5
   * @param options - method options.
   */
  static async request(options: RequestOptions = {}): Promise<RequestViewportResult> {
    const { timeout = 1000, ...restOptions } = options;
    const {
      is_expanded: isExpanded,
      is_state_stable: isStateStable,
      ...rest
    } = await request('web_app_request_viewport', 'viewport_changed', {
      ...restOptions,
      timeout,
    });

    return { ...rest, isExpanded, isStateStable };
  }

  /**
   * Synchronizes specified instance of Viewport with the actual value in the native
   * application.
   * @param viewport - Viewport instance.
   */
  static sync(viewport: Viewport): void {
    on('viewport_changed', (event) => {
      const {
        height,
        width,
        is_expanded: isExpanded,
        is_state_stable: isStateStable,
      } = event;
      const formattedHeight = truncate(height);

      viewport.state.set({
        height: formattedHeight,
        isExpanded,
        width: truncate(width),
        stableHeight: isStateStable ? formattedHeight : undefined,
      });
    });
  }

  /**
   * Returns initialized instance of Viewport which is synchronized with
   * its actual state in Web Apps.
   * @param options - method options.
   */
  static async synced(options: RequestOptions = {}): Promise<Viewport> {
    const { height, isExpanded, width } = await this.request(options);
    const viewport = new Viewport(height, width, height, isExpanded, options.postEvent);

    this.sync(viewport);

    return viewport;
  }

  private readonly ee = new EventEmitter<ViewportEvents>();

  private readonly state: State<ViewportState>;

  constructor(
    height: number,
    width: number,
    stableHeight: number,
    isExpanded: boolean,
    private readonly postEvent: PostEvent = defaultPostEvent,
  ) {
    this.state = new State({
      height: truncate(height),
      isExpanded,
      stableHeight: truncate(stableHeight),
      width: truncate(width),
    }, this.ee);
  }

  /**
   * The current height of the visible area of the Web App.
   *
   * The application can display just the top part of the Web App, with its
   * lower part remaining outside the screen area. From this position, the
   * user can "pull" the Web App to its maximum height, while the bot can do
   * the same by calling `expand` method. As the position of the Web App
   * changes, the current height value of the visible area will be updated
   * in real time.
   *
   * Please note that the refresh rate of this value is not sufficient
   * to smoothly follow the lower border of the window. It should not be
   * used to pin interface elements to the bottom of the visible area. It's
   * more appropriate to use the value of the `stableHeight`
   * field for this purpose.
   *
   * @see init
   * @see expand
   * @see stableHeight
   */
  get height(): number {
    return this.state.get('height');
  }

  /**
   * The height of the visible area of the Web App in its last stable state.
   *
   * The application can display just the top part of the Web App, with its
   * lower part remaining outside the screen area. From this position,
   * the user can "pull" the Web App to its maximum height, while the bot can
   * do the same by calling `expand` method.
   *
   * Unlike the value of `height`, the value of `stableHeight`
   * does not change as the position of the Web App changes with user
   * gestures or during animations. The value of `stableHeight`
   * will be updated after all gestures and animations are completed and
   * the Web App reaches its final size.
   *
   * @see init
   * @see expand
   * @see height
   */
  get stableHeight(): number {
    return this.state.get('stableHeight');
  }

  /**
   * Returns true if the Web App is expanded to the maximum available height.
   * Otherwise, if the Web App occupies part of the screen and can be expanded
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
   * A method that expands the Web App to the maximum available height. To
   * find out if the Web App is expanded to the maximum height, refer to the
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
  on: typeof this.ee.on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: typeof this.ee.off = this.ee.off.bind(this.ee);
}
