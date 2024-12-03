import { off } from '@telegram-apps/bridge';

import {
  CSA_CHANGED_EVENT,
  FS_CHANGED_EVENT,
  SA_CHANGED_EVENT,
  VIEWPORT_CHANGED_EVENT,
  VISIBILITY_CHANGED_EVENT
} from '../../const.js';
import { isMounted, mountPromise } from '../../signals/mounting.js';

import {
  onContentSafeAreaChanged,
  onFullscreenChanged,
  onSafeAreaChanged,
  onViewportChanged,
  onVisibilityChanged
} from './shared.js';

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
  off(SA_CHANGED_EVENT, onSafeAreaChanged);
  off(CSA_CHANGED_EVENT, onContentSafeAreaChanged);
  off(VISIBILITY_CHANGED_EVENT, onVisibilityChanged);

  // Drop the mount flag.
  isMounted.set(false);
}