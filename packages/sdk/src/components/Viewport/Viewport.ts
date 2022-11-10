import {EventEmitter} from 'twa-core';
import {ViewportEventsMap} from './events';
import {
  Bridge,
  BridgeEventListener,
  init,
  ViewportChangedPayload,
} from 'twa-bridge';
import {processBridgeProp} from '../../utils';
import {WithCommonProps} from '../../types';

export interface ViewportProps extends WithCommonProps {
  height?: number;
  width?: number;
  stableHeight?: number;
  isExpanded?: boolean;
}

export interface UpdateViewportProps {
  height?: number,
  width?: number;
  isExpanded?: boolean,
  isStateStable?: boolean
}

/**
 * Formats dimension before setting in viewport.
 * @param dim - dimension to format.
 */
function truncate(dim: number): number {
  return dim < 0 ? 0 : dim;
}

/**
 * Contains information about current WebApp device viewport, its dimensions
 * and state.
 */
export class Viewport {
  /**
   * Requests fresh information about current viewport.
   * @param bridge - bridge instance.
   */
  static request(bridge = init()): Promise<ViewportChangedPayload> {
    return new Promise(res => {
      const listener: BridgeEventListener<'viewport_changed'> = payload => {
        // Remove previously bound listener.
        bridge.off('viewport_changed', listener);

        // Resolve result.
        res(payload);
      }

      // Add listener which will resolve promise in case, viewport information
      // was received.
      bridge.on('viewport_changed', listener);

      // Emit event to receive viewport information.
      bridge.postEvent('web_app_request_viewport');
    });
  }

  private readonly ee = new EventEmitter<ViewportEventsMap>();
  private readonly bridge: Bridge;
  private _height: number;
  private _width: number;
  private _stableHeight: number;
  private _isExpanded: boolean;

  constructor(props: ViewportProps = {}) {
    const {
      height = 0,
      width = 0,
      stableHeight = 0,
      isExpanded = false,
      bridge,
    } = props;
    this.bridge = processBridgeProp(bridge);
    this._height = truncate(height);
    this._width = truncate(width);
    this._stableHeight = truncate(stableHeight);
    this._isExpanded = isExpanded;
  }

  private set height(value: number) {
    value = truncate(value);
    if (this._height === value) {
      return;
    }
    this._height = value;
    this.ee.emit('heightChange', value);
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
    value = truncate(value);
    if (this._stableHeight === value) {
      return;
    }
    this._stableHeight = value;
    this.ee.emit('stableHeightChange', value);
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
    this.ee.emit('expansionChange', value);
  }

  /**
   * `true`, if the Web App is expanded to the maximum available height.
   * `false`, if the Web App occupies part of the screen and can be expanded
   * to the full height using `expand` method.
   * @see expand
   */
  get isExpanded(): boolean {
    return this._isExpanded;
  }

  private set width(value: number) {
    value = truncate(value);
    if (this._width === value) {
      return;
    }
    this._width = value;
    this.ee.emit('widthChange', value);
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
   * `true`, in case current viewport height is stable and is not going to
   * change next moment.
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

  /**
   * Updates current information about viewport.
   *
   * @param props
   */
  update(props: UpdateViewportProps = {}): void {
    const {
      height = this.height,
      isExpanded = this.isExpanded,
      width = this.width,
      isStateStable = false,
    } = props;
    this.height = height;
    this.width = width;
    this.isExpanded = isExpanded;

    if (isStateStable) {
      this.stableHeight = height;
    }
  }
}
