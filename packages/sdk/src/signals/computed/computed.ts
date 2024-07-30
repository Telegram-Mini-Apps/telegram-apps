import { signal, type Signal } from '../signal/signal.js';
import { collectSignals } from '../reactive-context.js';

export interface Computed<T> extends Omit<Signal<T>, 'set' | 'reset'> {
  /**
   * @returns An underlying signal value.
   */
  (): T;
}

// @__NO_SIDE_EFFECTS__
export function computed<T>(fn: () => T): Computed<T> {
  let deps = new Set<Signal<unknown>>();
  const s = signal(compute());

  function update() {
    s.set(compute());
  }

  function compute(): T {
    // As long as in this iteration, we may receive new signals as dependencies, we stop
    // listening to the previous signals.
    deps.forEach(s => s.unsub(update));

    // Run the function and collect all called signals.
    const [result, signals] = collectSignals(fn);

    // Start tracking for all dependencies' changes and re-compute the computed value.
    signals.forEach(s => s.sub(update, true));
    deps = signals;

    return result;
  }

  return (['sub', 'unsub', 'unsubAll'] as const).reduce<Computed<T>>((acc, prop) => {
    Object.defineProperty(acc, prop, Object.getOwnPropertyDescriptor(s, prop)!);
    return acc;
  }, (function computed() {
    return s();
  }) as unknown as Computed<T>);
}
