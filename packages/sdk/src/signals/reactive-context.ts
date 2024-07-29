import type { Signal } from './signal/signal.js';

/**
 * Signals collected during the last call of the `collect` method.
 * @private
 */
let collectedSignals: Set<Signal<unknown>> | undefined;

/**
 * Runs specified function in a reactive context, collecting called signals.
 * @param fn - function to call.
 * @returns A tuple, containing a result of the function and collected signals.
 */
export function collectSignals<T>(fn: () => T): [
  /**
   * Function execution result.
   */
  result: T,
  /**
   * Collected signals.
   */
  signals: Set<Signal<unknown>>,
] {
  collectedSignals = new Set();

  try {
    // Call the function and start tracking for all captured reactive units.
    return [fn(), collectedSignals];
  } finally {
    // Remember to untrack the reactive context.
    collectedSignals = undefined;
  }
}

export function collectSignal(signal: Signal<any>): void {
  collectedSignals && collectedSignals.add(signal);
}