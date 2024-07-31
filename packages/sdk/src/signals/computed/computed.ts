import { signal, type Signal, SignalOptions } from '../signal/signal.js';
import { collectSignals } from '../reactive-context.js';

export interface Computed<T> extends Omit<Signal<T>, 'set' | 'reset'> {
  /**
   * @returns An underlying signal value.
   */
  (): T;
}

/*@__NO_SIDE_EFFECTS__*/
export function computed<T>(fn: () => T, options?: SignalOptions<T>): Computed<T> {
  // List of the signal dependencies.
  let deps = new Set<Signal<unknown>>();

  // True, if we already computed the value once.
  let computedOnce = false;

  // Underlying computed signal.
  const s = signal(undefined as T, options);

  /**
   * Updates the signal value using the `compute` function.
   */
  function update() {
    s.set(compute());
  }

  /**
   * Computes the value and dependencies based on the passed function.
   */
  function compute(): T {
    // As long as in this iteration, we may receive new signals as dependencies, we stop
    // listening to the previous signals.
    deps.forEach(s => s.unsub(update));

    // Run the function and collect all called signals.
    const [result, signals] = collectSignals(fn);

    // Start tracking for all dependencies' changes and re-compute the computed value.
    signals.forEach(s => s.sub(update, { signal: true }));
    deps = signals;

    computedOnce = true;

    return result;
  }

  /**
   * Updates the signal in case, it was not set initially.
   */
  function checkComputed() {
    !computedOnce && update();
  }

  /**
   * Computed signal itself.
   */
  function computed(): T {
    checkComputed();
    return s();
  }

  // We enhance the `sub` method with the initial value computation.
  // The reason is not computing the initial value, we don't know the dependencies.
  // So, we don't know when the re-computation must be performed and when subscribers should
  // be notified.
  Object.assign(computed, {
    sub(...args) {
      checkComputed();
      return s.sub(...args);
    },
    // All other properties are just proxied.
    unsub: s.unsub,
    unsubAll: s.unsubAll,
  } satisfies Pick<Computed<T>, 'sub' | 'unsub' | 'unsubAll'>);

  return computed as Computed<T>;
}
