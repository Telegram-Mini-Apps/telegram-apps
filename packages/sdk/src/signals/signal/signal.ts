import { collectSignal } from '../reactive-context.js';
import type { ListenerFn, UnsubscribeFn } from '../types.js';

export interface SignalOverrides<T> {
  set?(this: void, signal: Signal<T>, value: T): void;
}

export interface Signal<T> {
  /**
   * @returns An underlying signal value.
   */
  (): T;
  /**
   * Updates the signal notifying all subscribers about changes.
   * @param value - value to set.
   */
  set(value: T): void;
  /**
   * Resets the signal value to its initial value.
   */
  reset(): void;
  /**
   * Adds a new listener, tracking the signal changes.
   * @param fn - event listener.
   * @param signalListener - true, if the listener was added by some other signal.
   * @returns A function to remove bound listener.
   */
  sub(fn: ListenerFn<T>, signalListener?: boolean): UnsubscribeFn;
  /**
   * Removes a listener, tracking the signal changes.
   * @param fn - event listener.
   */
  unsub(fn: ListenerFn<T>): void;
  /**
   * Removes all signal change listeners, not added by other signals.
   */
  unsubAll(): void;
}

export function signal<T>(initialValue: T, overrides?: SignalOverrides<T>): Signal<T> {
  overrides ||= {};

  let listeners: [
    /**
     * Actual change listener.
     */
    listener: ListenerFn<T>,
    /**
     * True, if the listener was added by some other signal.
     */
    signalListener?: boolean
  ][] = [];
  let value: T = initialValue;

  const s = Object.assign(
    function get(): T {
      collectSignal(s);
      return value;
    },
    {
      set(v) {
        if (value !== v) {
          value = v;

          // We are making a copy of listeners as long as they may mutate the listeners' array,
          // leading to an unexpected behavior.
          //
          // We want the setter to make sure that all listeners will be called in predefined
          // order withing a single update frame.
          [...listeners].forEach(item => item[0](v));
        }
      },
      reset() {
        this.set(initialValue);
      },
      sub(fn, signalListener) {
        listeners.push([fn, signalListener]);
        return () => this.unsub(fn);
      },
      unsub(fn): void {
        const idx = listeners.findIndex(item => item[0] === fn);
        if (idx >= 0) {
          listeners.splice(idx, 1);
        }
      },
      unsubAll() {
        listeners = listeners.filter(item => item[1]);
      },
    } satisfies Pick<Signal<T>, 'set' | 'reset' | 'sub' | 'unsub' | 'unsubAll'>,
  );

  const { set: overridesSet } = overrides;
  if (overridesSet) {
    return Object.assign(
      function overridden() {
        return s();
      },
      s,
      {
        set(v) {
          overridesSet(s, v);
        },
      } satisfies Pick<Signal<T>, 'set'>,
    );
  }

  return s;
}