import { collectSignal } from './computed.js';
import { runInBatchMode } from './batch.js';

export type SubscribeListenerFn<Current, Previous = Current> = (current: Current, previous: Previous) => void;
export type RemoveListenerFn = () => void;

export interface SignalOptions<Current, Next = Current> {
  /**
   * Previous and next values comparator.
   *
   * This function is used during the actual and incoming values comparison in the `set` method.
   * If values are considered the same, no subscribers will be called.
   *
   * @default Object.is
   * @param current - the actual value.
   * @param next - an incoming value.
   * @returns True if values are considered the same.
   */
  equals?: (current: Current | Next, next: Next) => boolean;
}

export interface Signal<TGet, TSet extends TGet = TGet> {
  /**
   * @returns An underlying signal value.
   */
  (): TGet | TSet;
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
   * **Silently** resets the signal to its initial value.
   */
  reset: () => void;
  /**
   * Updates the signal notifying all subscribers about changes.
   * @param value - value to set.
   */
  set: (value: TSet) => void;
  /**
   * Adds a new listener, tracking the signal changes.
   * @param fn - event listener.
   * @param once - call listener only once.
   * @returns A function to remove the bound listener.
   */
  sub: (fn: SubscribeListenerFn<TSet, TGet>, once?: boolean) => RemoveListenerFn;
  /**
   * Removes a listener, tracking the signal changes.
   * @param fn - event listener.
   * @param once - was this listener added for a single call. Default: false
   */
  unsub: (fn: SubscribeListenerFn<TSet, TGet>, once?: boolean) => void;
}

/**
 * Creates a new signal with initial value.
 * @param initialValue - initial value.
 * @param options - additional options.
 */
export function signal<TGet, TSet extends TGet = TGet>(
  initialValue: TGet | TSet,
  options?: SignalOptions<TGet, TSet>,
): Signal<TGet, TSet>;

/**
 * Creates a new signal without initial value.
 * @param initialValue
 * @param options - additional options.
 */
export function signal<TGet, TSet extends TGet = TGet>(
  initialValue?: TGet | TSet,
  options?: SignalOptions<TGet | undefined, TSet>,
): Signal<TGet | undefined, TSet>;

// #__NO_SIDE_EFFECTS__
export function signal<TGet, TSet extends TGet = TGet>(
  initialValue?: TGet | TSet,
  options?: SignalOptions<TGet | undefined, TSet>,
): Signal<TGet | undefined, TSet> {
  type CurrentSignal = Signal<TGet | undefined, TSet>;

  options ||= {};
  const equals = options.equals || Object.is;

  let listeners: [listener: SubscribeListenerFn<TSet, TGet | undefined>, once?: boolean][] = [];
  let value: ReturnType<CurrentSignal> = initialValue;

  const set: CurrentSignal['set'] = v => {
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

  const unsub: CurrentSignal['unsub'] = (fn, once) => {
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
        value = initialValue;
      },
      sub(fn, once) {
        listeners.push([fn, once]);
        return () => unsub(fn, once);
      },
      unsub,
    } satisfies Pick<CurrentSignal, 'destroy' | 'set' | 'reset' | 'sub' | 'unsub'>,
  );

  return s;
}
