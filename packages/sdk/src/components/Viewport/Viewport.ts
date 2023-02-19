import {EventEmitter} from '@twa.js/utils';
import {BridgeEventListener} from '@twa.js/bridge';

import {ViewportEventsMap} from './events';
import {BridgeLike} from '../../types';

export interface RequestViewportResult {
  height: number;
  width: number;
  isStateStable: boolean;
  isExpanded: boolean;
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
   *  long as method web_app_request_viewport does not work on `tdesktop`
   *  and `macos` platforms.
   * @see Issue: https://github.com/Telegram-Web-Apps/twa/issues/5
   * @param bridge - bridge instance.
   */
  static request(bridge: BridgeLike): Promise<RequestViewportResult> {
    // Emit event to receive viewport information.
    bridge.postEvent('web_app_request_viewport');

    return new Promise(res => {
      const listener: BridgeEventListener<'viewport_changed'> = payload => {
        // Remove previously bound listener.
        bridge.off('viewport_changed', listener);

        // Resolve result.
        const {
          height,
          width,
          is_expanded: isExpanded,
          is_state_stable: isStateStable,
        } = payload;
        res({height, isExpanded, width, isStateStable});
      };

      // Add listener which will resolve promise in case, viewport information
      // was received.
      bridge.on('viewport_changed', listener);
    });
  }

  /**
   * Returns initialized instance of Viewport which is synchronized with
   * its actual state in Web Apps.
   * @param bridge - bridge instance.
   * @param height - viewport height.
   * @param width - viewport width.
   * @param stableHeight - viewport stable height.
   * @param isExpanded - viewport expansion status.
   */
  static synced(
    bridge: BridgeLike,
    height: number,
    width: number,
    stableHeight: number,
    isExpanded: boolean,
  ): Viewport {
    const v = new Viewport(bridge, height, width, stableHeight, isExpanded);

    bridge.on('viewport_changed', event => {
      const {
        height,
        width,
        is_expanded: isExpanded,
        is_state_stable: isStateStable,
      } = event;
      v.height = truncate(height);
      v.width = truncate(width);
      v.isExpanded = isExpanded;

      if (isStateStable) {
        v.stableHeight = v.height;
      }
    });

    return v;
  }

  private readonly ee = new EventEmitter<ViewportEventsMap>();
  private _height: number;
  private _width: number;
  private _stableHeight: number;
  private _isExpanded: boolean;

  constructor(
    private readonly bridge: BridgeLike,
    height: number,
    width: number,
    stableHeight: number,
    isExpanded: boolean,
  ) {
    this._height = truncate(height);
    this._width = truncate(width);
    this._stableHeight = truncate(stableHeight);
    this._isExpanded = isExpanded;
  }

  private set height(value: number) {
    if (this._height === value) {
      return;
    }
    this._height = value;
    this.ee.emit('heightChanged', value);
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
    return this._height;
  }

  private set stableHeight(value: number) {
    if (this._stableHeight === value) {
      return;
    }
    this._stableHeight = value;
    this.ee.emit('stableHeightChanged', value);
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
    return this._stableHeight;
  }

  private set isExpanded(value: boolean) {
    if (this._isExpanded === value) {
      return;
    }
    this._isExpanded = value;
    this.ee.emit('isExpandedChanged', value);
  }

  /**
   * Returns true if the Web App is expanded to the maximum available height.
   * Otherwise, if the Web App occupies part of the screen and can be expanded
   * to the full height using `expand` method.
   * @see expand
   */
  get isExpanded(): boolean {
    return this._isExpanded;
  }

  private set width(value: number) {
    if (this._width === value) {
      return;
    }
    this._width = value;
    this.ee.emit('widthChanged', value);
  }

  /**
   * Current viewport width.
   */
  get width(): number {
    return this._width;
  }

  /**
   * A method that expands the Web App to the maximum available height. To
   * find out if the Web App is expanded to the maximum height, refer to the
   * value of the `isExpanded`.
   * @see isExpanded
   */
  expand(): void {
    this.bridge.postEvent('web_app_expand');
  }

  /**
   * Returns true in case current viewport height is stable and is not going to
   * change in the next moment.
   */
  get isStable(): boolean {
    return this._stableHeight === this._height;
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
