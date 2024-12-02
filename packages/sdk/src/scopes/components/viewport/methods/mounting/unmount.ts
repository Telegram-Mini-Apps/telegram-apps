import { off } from '@telegram-apps/bridge';

import { FS_CHANGED_EVENT, VIEWPORT_CHANGED_EVENT } from '../../const.js';
import { isMounted, mountPromise } from '../../signals/mounting.js';

import { onFullscreenChanged, onViewportChanged } from './shared.js';

/**
 * Unmounts the Viewport.
 */
export function unmount(): void {
  // Cancel mount promise.
  const promise = mountPromise();
  promise && promise.cancel();

  // TODO: Cancel all promises?

  // Remove event listeners.
  off(VIEWPORT_CHANGED_EVENT, onViewportChanged);
  off(FS_CHANGED_EVENT, onFullscreenChanged);

  // Drop the mount flag.
  isMounted.set(false);
}