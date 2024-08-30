import { collectSignal } from './computed.js';
import { runInBatchMode } from './batch.js';

export type SubscribeListenerFn<T> = (actualValue: T, prevValue: T) => void;
export type RemoveListenerFn = () => void;

export interface SignalOptions<T> {
  /**
   * Previous and next values comparator.
   *
   * This function is used during the actual and incoming values comparison in the `set` method.
   * If values are considered the same, no subscribers will be called.
   *
   * @default Object.is
   * @param current - the actual value.
   * @param incoming - an incoming value.
   * @returns True if values are considered the same.
   */
  equals?: (current: T, incoming: T) => boolean;
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
  destroy: () => void;
  /**
   * Resets the signal value to its initial value.
   */
  reset: () => void;
  /**
   * Updates the signal notifying all subscribers about changes.
   * @param value - value to set.
   */
  set: (value: T) => void;
  /**
   * Adds a new listener, tracking the signal changes.
   * @param fn - event listener.
   * @param once - call listener only once.
   * @returns A function to remove the bound listener.
   */
  sub: (fn: SubscribeListenerFn<T>, once?: boolean) => RemoveListenerFn;
  /**
   * Removes a listener, tracking the signal changes.
   * @param fn - event listener.
   * @param once - was this listener added for a single call. Default: false
   */
  unsub: (fn: SubscribeListenerFn<T>, once?: boolean) => void;
}

/**
 * Creates a new signal with initial value.
 * @param initialValue - initial value.
 * @param options - additional options.
 */
export function signal<T>(
  initialValue: T,
  options?: SignalOptions<T>,
): Signal<T>

/**
 * Creates a new signal without initial value.
 * @param initialValue
 * @param options - additional options.
 */
export function signal<T>(
  initialValue?: T,
  options?: SignalOptions<T | undefined>,
): Signal<T | undefined>;

// #__NO_SIDE_EFFECTS__
export function signal<T>(
  initialValue?: T,
  options?: SignalOptions<T | undefined>,
): Signal<T | undefined> {
  options ||= {};
  const equals = options.equals || Object.is;

  let listeners: [listener: SubscribeListenerFn<T | undefined>, once?: boolean][] = [];
  let value: T | undefined = initialValue;

  const set: Signal<T | undefined>['set'] = v => {
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
    function get() {
      collectSignal(s);
      return value;
    },
    {
      destroy() {
        listeners = [];
      },
      set,
      reset() {
        set(initialValue as T);
      },
      sub(fn, once) {
        listeners.push([fn, once]);
        return () => unsub(fn, once);
      },
      unsub,
    } satisfies Pick<Signal<T | undefined>, 'destroy' | 'set' | 'reset' | 'sub' | 'unsub'>,
  );

  return s;
}
