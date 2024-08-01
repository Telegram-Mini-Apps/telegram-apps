import { collectSignal } from './reactive-context.js';
import type { ListenerFn, UnsubscribeFn } from './types.js';

export interface SignalOptions<T> {
  /**
   * Previous and next values comparator. Should return true if values are the same.
   *
   * By default, signals compares values directly using "===".
   * @param a - current value.
   * @param b - incoming value.
   * @returns True if values are considered the same.
   */
  equals?(this: void, a: T, b: T): boolean;
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
  set(this: void, value: T): void;
  /**
   * Resets the signal value to its initial value.
   */
  reset(this: void): void;
  /**
   * Adds a new listener, tracking the signal changes.
   * @param fn - event listener.
   * @param options - additional options.
   * @returns A function to remove bound listener.
   */
  sub(this: void, fn: ListenerFn<T>, options?: {
    /**
     * True if the listener was added by some other signal.
     */
    signal?: boolean;
    /**
     * Should this listener be called only once.
     * @default false
     */
    once?: boolean;
  }): UnsubscribeFn;
  /**
   * Removes a listener, tracking the signal changes.
   * @param fn - event listener.
   * @param once - was this listener added for a single call. Default: false
   */
  unsub(this: void, fn: ListenerFn<T>, once?: boolean): void;
  /**
   * Removes all signal change listeners, not added by other signals.
   */
  unsubAll(this: void): void;
}

/*@__NO_SIDE_EFFECTS__*/
export function signal<T>(initialValue: T, options?: SignalOptions<T>): Signal<T> {
  options ||= {};
  const equals = options.equals || ((a, b) => a === b);

  let listeners: [
    /**
     * Actual change listener.
     */
    listener: ListenerFn<T>,
    /**
     * Should this listener be called only once.
     */
    once?: boolean,
    /**
     * True, if the listener was added by some other signal.
     */
    signalListener?: boolean
  ][] = [];
  let value: T = initialValue;

  const set: Signal<T>['set'] = v => {
    if (!equals(value, v)) {
      value = v;

      // We are making a copy of listeners as long as they may mutate the listeners' array,
      // leading to an unexpected behavior.
      //
      // We want the setter to make sure that all listeners will be called in predefined
      // order withing a single update frame.
      [...listeners].forEach(([fn, once]) => {
        fn(v);

        // Remove "once" listeners.
        if (once) {
          unsub(fn, true);
        }
      });
    }
  };

  const unsub: Signal<T>['unsub'] = (fn, once) => {
    const idx = listeners.findIndex(item => {
      return item[0] === fn && item[1] === !!once;
    });
    if (idx >= 0) {
      listeners.splice(idx, 1);
    }
  };

  const s = Object.assign(
    function get(): T {
      collectSignal(s);
      return value;
    },
    {
      set,
      reset() {
        set(initialValue);
      },
      sub(fn, options) {
        options ||= {};
        const { once } = options;
        listeners.push([fn, !!once, options.signal]);
        return () => unsub(fn, once);
      },
      unsub,
      unsubAll() {
        // We are removing only non-signal listeners. This is due to we don't want this method
        // to break computed signals tracking of other signals.
        listeners = listeners.filter(item => item[2]);
      },
    } satisfies Pick<Signal<T>, 'set' | 'reset' | 'sub' | 'unsub' | 'unsubAll'>,
  );

  return s;
}
