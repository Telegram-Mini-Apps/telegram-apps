import { signal, type Signal, type SignalOptions } from './signal.js';

export interface Computed<T> extends Omit<Signal<T>, 'set' | 'reset'> {
  /**
   * @returns An underlying signal value.
   */
  (): T;
}

const collectContexts: Set<Signal<unknown>>[] = [];

export function collectSignal(signal: Signal<any>): void {
  collectContexts.length && collectContexts[collectContexts.length - 1].add(signal);
}

/*@__NO_SIDE_EFFECTS__*/
export function computed<T>(fn: () => T, options?: SignalOptions<T>): Computed<T> {
  let deps = new Set<Signal<unknown>>();
  let isComputedOnce = false;
  const s = signal<T>(undefined as T, options);

  function update() {
    s.set(compute());
  }

  function updateWithComputed() {
    !isComputedOnce && update();
  }

  function compute(): T {
    isComputedOnce = true;

    // As long as in this iteration, we may receive new signals as dependencies, we stop
    // listening to the previous signals.
    deps.forEach(s => s.unsub(update));

    // Signals we collected during current computation.
    const collectedSignals = new Set<Signal<unknown>>();
    let result: T;

    // Add this set to the global variable, so dependant signals will be catched.
    collectContexts.push(collectedSignals);

    try {
      // Run the function and collect all called signals.
      result = fn();
    } finally {
      // Remember to untrack the reactive context.
      collectContexts.splice(collectContexts.length - 1, 1);
    }

    // Start tracking for all dependencies' changes and re-compute the computed value.
    collectedSignals.forEach(s => s.sub(update));
    deps = collectedSignals;

    return result;
  }

  return Object.assign(function computed(): T {
    updateWithComputed();
    return s();
  }, {
    destroy: s.destroy,
    sub(fn, options) {
      updateWithComputed();
      return s.sub(fn, options);
    },
    unsub: s.unsub,
  } satisfies Pick<Computed<T>, 'destroy' | 'sub' | 'unsub'>);
}
