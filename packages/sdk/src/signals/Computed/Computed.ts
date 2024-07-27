import { Signal } from '@/signals/signal/signal.js';

export class Computed<T> extends Signal<T> {
  private signals = new Set<Signal<unknown>>();

  constructor(private fn: () => T) {
    // We do it intentionally, because it will not affect any flows. I know, it is not right,
    // but we can't call "this.*" before calling the "super" function.
    super(null as any);
    this.update();
  }

  /**
   * Re-computes the internal value.
   */
  private update = (): void => {
    // As long as in this iteration, we may receive new signals as dependencies, we stop
    // listening to the previous signals.
    this.signals.forEach(s => s.unsubscribe(this.update));

    // Run the function and collect all called signals.
    const [result, signals] = Signal.collect(this.fn);

    // Start tracking for all dependencies' changes and re-compute the computed value.
    signals.forEach(s => s.subscribe(this.update));
    this.signals = signals;

    // Update the internal value.
    this.set(result);
  }
}
