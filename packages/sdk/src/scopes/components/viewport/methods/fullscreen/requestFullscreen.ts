import { createFullscreenFn } from './createFullscreenFn.js';
import { REQUEST_FS_METHOD } from '../../const.js';

/**
 * Requests fullscreen mode for the mini application.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_FULLSCREEN_FAILED
 * @example Using `isAvailable()`
 * if (requestFullscreen.isAvailable() && !isChangingFullscreen()) {
 *   await requestFullscreen();
 * }
 * @example Using `ifAvailable()`
 * if (!isChangingFullscreen()) {
 *   await requestFullscreen.ifAvailable();
 * }
 */
export const requestFullscreen = createFullscreenFn('requestFullscreen', REQUEST_FS_METHOD);