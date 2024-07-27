import type { UnsubscribeFn, ListenerFn } from '@/signals/Signal/types.js';

export class Signal<T> {
  private listeners: ListenerFn<T>[] = [];

  /**
   * Signals collected during the last call of the `collect` method.
   * @private
   */
  private static collectedSignals?: Set<Signal<unknown>>;

  /**
   * Runs specified function in a reactive context, collecting called signals.
   * @param fn - function to call.
   * @returns A tuple, containing a result of the function and collected signals.
   */
  static collect<T>(fn: () => T): [
    /**
     * Function execution result.
     */
    result: T,
    /**
     * Collected signals.
     */
    signals: Set<Signal<unknown>>,
  ] {
    this.collectedSignals = new Set();

    try {
      // Call the function and start tracking for all captured reactive units.
      return [fn(), this.collectedSignals];
    } finally {
      // Remember to untrack the reactive context.
      this.collectedSignals = undefined;
    }
  }

  private static registerGet(signal: Signal<any>): void {
    this.collectedSignals && this.collectedSignals.add(signal);
  }

  constructor(private value: T) {
  }

  /**
   * @returns An underlying signal value.
   */
  get(): T {
    Signal.registerGet(this);
    return this.value;
  }

  /**
   * Updates the signal notifying all subscribers about changes.
   * @param value - value to set.
   */
  set(value: T) {
    if (this.value !== value) {
      this.value = value;

      // We are making a copy of listeners as long as they may mutate the listeners' array,
      // leading to an unexpected behavior.
      //
      // We want the setter to make sure that all listeners will be called in predefined
      // order withing a single update frame.
      [...this.listeners].forEach(l => l(value));
    }
  }

  /**
   * Adds a new listener, tracking the signal changes.
   * @param fn - event listener.
   * @returns Function to remove bound listener.
   */
  subscribe(fn: ListenerFn<T>): UnsubscribeFn {
    this.listeners.push(fn);
    return () => this.unsubscribe(fn);
  }

  /**
   * Removes a listener, tracking the signal changes.
   * @param fn - event listener.
   */
  unsubscribe(fn: ListenerFn<T>): void {
    const idx = this.listeners.indexOf(fn);
    if (idx >= 0) {
      this.listeners.splice(idx, 1);
    }
  }

  /**
   * Removes all signal change listeners.
   */
  unsubscribeAll(): void {
    this.listeners = [];
  }
}
