import { signal, type Signal, type SignalOptions } from './signal.js';

export interface Computed<T> extends Omit<Signal<T>, 'set' | 'reset'> {
  /**
   * @returns An underlying signal value.
   */
  (): T;
}

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
function collectSignals<T>(fn: () => T): [
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
    unsub: s.unsub.bind(s),
    unsubAll: s.unsubAll.bind(s),
  } satisfies Pick<Computed<T>, 'sub' | 'unsub' | 'unsubAll'>);

  return computed as Computed<T>;
}
