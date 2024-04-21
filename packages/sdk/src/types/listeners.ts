/**
 * Cleanup function.
 */
export interface CleanupFn {
  (): void;
}

/**
 * Function, which removes bound event listener.
 */
export interface RemoveEventListenerFn extends CleanupFn {}
