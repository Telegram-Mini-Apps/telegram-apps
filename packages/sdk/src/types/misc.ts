/**
 * Any function.
 */
export interface AnyFn {
  (...args: any): any;
}

/**
 * Function which performs some cleanup.
 */
export interface CleanupFn {
  (): void;
}
