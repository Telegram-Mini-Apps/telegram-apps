import { collectSignal } from './computed.js';
import { runInBatchMode } from './batch.js';

export type SubscribeListenerFn<T> = (actualValue: T, prevValue: T) => void;

export interface SignalOptions<T> {
  /**
   * Previous and next values comparator.
   *
   * This function is used during the actual and incoming values comparison in the `set` method.
   * If values are considered the same, no subscribers will be called.
   *
   * @default Object.is
   * @param a - the actual value.
   * @param b - an incoming value.
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
   * Destroys the signal removing all bound listeners.
   *
   * We usually use this method when the signal is not needed anymore.
   *
   * Take note that as long as call of this method removes all bound listeners, computed signals
   * based on the current one will stop listening to its changes, possibly making it work
   * improperly.
   */
  destroy(this: void): void;
  /**
   * Resets the signal value to its initial value.
   */
  reset(this: void): void;
  /**
   * Updates the signal notifying all subscribers about changes.
   * @param value - value to set.
   */
  set(this: void, value: T): void;
  /**
   * Adds a new listener, tracking the signal changes.
   * @param fn - event listener.
   * @param options - additional options.
   * @returns A function to remove the bound listener.
   */
  sub(this: void, fn: SubscribeListenerFn<T>, options?: {
    /**
     * Should this listener be called only once.
     * @default false
     */
    once?: boolean;
  }): () => void;
  /**
   * Removes a listener, tracking the signal changes.
   * @param fn - event listener.
   * @param once - was this listener added for a single call. Default: false
   */
  unsub(this: void, fn: SubscribeListenerFn<T>, once?: boolean): void;
}

/*@__NO_SIDE_EFFECTS__*/
export function signal<T>(initialValue: T, options?: SignalOptions<T>): Signal<T> {
  options ||= {};
  const equals = options.equals || Object.is;

  let listeners: [
    listener: SubscribeListenerFn<T>,
    once?: boolean,
  ][] = [];
  let value: T = initialValue;

  const set: Signal<T>['set'] = v => {
    if (!equals(value, v)) {
      const prev = value;
      value = v;

      // We are making a copy of listeners as long as they may mutate the listeners' array,
      // leading to an unexpected behavior.
      //
      // We want the setter to make sure that all listeners will be called in predefined
      // order within a single update frame.
      runInBatchMode(s, () => {
        [...listeners].forEach(([fn, once]) => {
          fn(v, prev);

          // Remove "once" listeners.
          if (once) {
            unsub(fn, true);
          }
        });
      });
    }
  };

  const unsub: Signal<T>['unsub'] = (fn, once) => {
    const idx = listeners.findIndex(item => {
      return item[0] === fn && !!item[1] === !!once;
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
      destroy() {
        listeners = [];
      },
      set,
      reset() {
        set(initialValue);
      },
      sub(fn, options) {
        const once = (options || {}).once;
        listeners.push([fn, once]);
        return () => unsub(fn, once);
      },
      unsub,
    } satisfies Pick<Signal<T>, 'destroy' | 'set' | 'reset' | 'sub' | 'unsub'>,
  );

  return s;
}
