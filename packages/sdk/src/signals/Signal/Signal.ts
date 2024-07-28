import { collectSignal } from '../reactive-context.js';
import type { UnsubscribeFn, ListenerFn } from '../types.js';

export class Signal<T> {
  private listeners: [
    /**
     * Actual change listener.
     */
    listener: ListenerFn<T>,
    /**
     * True, if the listener was added by some other signal.
     */
    signalListener?: boolean
  ][] = [];

  constructor(private value: T) {
  }

  /**
   * @returns An underlying signal value.
   */
  get(): T {
    collectSignal(this);
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
      [...this.listeners].forEach(item => item[0](value));
    }
  }

  /**
   * Adds a new listener, tracking the signal changes.
   * @param fn - event listener.
   * @param signalListener - true, if the listener was added by some other signal.
   * @returns Function to remove bound listener.
   */
  sub(fn: ListenerFn<T>, signalListener?: boolean): UnsubscribeFn {
    this.listeners.push([fn, signalListener]);
    return () => this.unsub(fn);
  }

  /**
   * Removes a listener, tracking the signal changes.
   * @param fn - event listener.
   */
  unsub(fn: ListenerFn<T>): void {
    const idx = this.listeners.findIndex(item => item[0] === fn);
    if (idx >= 0) {
      this.listeners.splice(idx, 1);
    }
  }

  /**
   * Removes all signal change listeners, not added by other signals.
   */
  unsubAll(): void {
    this.listeners = this.listeners.filter(item => item[1]);
  }
}
