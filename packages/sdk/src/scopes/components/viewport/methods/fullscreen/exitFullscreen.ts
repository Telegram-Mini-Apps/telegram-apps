import { createFullscreenFn } from './createFullscreenFn.js';

/**
 * Exits mini application fullscreen mode.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_FULLSCREEN_FAILED
 * @example Using `isAvailable()`
 * if (exitFullscreen.isAvailable() && !isChangingFullscreen()) {
 *   await exitFullscreen();
 * }
 * @example Using `ifAvailable()`
 * if (!isChangingFullscreen()) {
 *   await exitFullscreen.ifAvailable();
 * }
 */
export const exitFullscreen = createFullscreenFn('exitFullscreen', 'web_app_exit_fullscreen');