import { signalFromState } from './state.js';

/**
 * Signal containing the current height of the **visible area** of the Mini App.
 *
 * The application can display just the top part of the Mini App, with its
 * lower part remaining outside the screen area. From this position, the user
 * can "pull" the Mini App to its maximum height, while the bot can do the same
 * by calling `expand` method. As the position of the Mini App changes, the
 * current height value of the visible area will be updated  in real time.
 *
 * Please note that the refresh rate of this value is not sufficient to
 * smoothly follow the lower border of the window. It should not be used to pin
 * interface elements to the bottom of the visible area. It's more appropriate
 * to use the value of the `stableHeight` field for this purpose.
 *
 * @see stableHeight
 */
export const height = signalFromState('height');

/**
 * Signal containing the height of the visible area of the Mini App in its last stable state.
 *
 * The application can display just the top part of the Mini App, with its
 * lower part remaining outside the screen area. From this position, the user
 * can "pull" the Mini App to its maximum height, while the application can do
 * the same by calling `expand` method.
 *
 * Unlike the value of `height`, the value of `stableHeight` does not change as
 * the position of the Mini App changes with user gestures or during
 * animations. The value of `stableHeight` will be updated after all gestures
 * and animations are completed and the Mini App reaches its final size.
 *
 * @see height
 */
export const stableHeight = signalFromState('stableHeight');

/**
 * Signal containing the currently visible area width.
 */
export const width = signalFromState('width');
