import { computed, signal } from '@telegram-apps/signals';
import type { CancelablePromise } from '@telegram-apps/bridge';

import { signalFromState } from './state.js';

/**
 * Signal indicating if the viewport is currently in fullscreen mode.
 */
export const isFullscreen = signalFromState('isFullscreen');

/**
 * Signal containing fullscreen request or exit promise.
 */
export const changeFullscreenPromise = signal<CancelablePromise<void>>();

/**
 * Signal indicating if the fullscreen mode request is currently in progress.
 */
export const isChangingFullscreen = computed(() => {
  return !!changeFullscreenPromise();
});

/**
 * Signal containing an error received during the last fullscreen mode request.
 */
export const changeFullscreenError = signal<Error | undefined>();
