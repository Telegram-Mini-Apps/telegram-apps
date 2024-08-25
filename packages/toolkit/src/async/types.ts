export interface AsyncOptions {
  /**
   * Signal to abort the execution.
   */
  abortSignal?: AbortSignal;
  /**
   * Execution timeout.
   */
  timeout?: number;
}
