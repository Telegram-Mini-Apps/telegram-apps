import { signal, type Signal } from '../signal/signal.js';
import { collectSignals } from '../reactive-context.js';

// export class Computed<T> {
//   private signal: Signal<T>;
//   private deps = new Set<Signal<unknown>>();
//
//   constructor(private fn: () => T) {
//     const s = new Signal(this.compute());
//     this.signal = s;
//     this.get = s.get.bind(s);
//     this.sub = s.sub.bind(s);
//     this.unsub = s.unsub.bind(s);
//     this.unsubAll = s.unsubAll.bind(s);
//   }
//
//   /**
//    * Computes the signal value reassigning dependencies.
//    * @returns Internal function result.
//    */
//   compute(): T {
//     // As long as in this iteration, we may receive new signals as dependencies, we stop
//     // listening to the previous signals.
//     this.deps.forEach(s => s.unsub(this.update));
//
//     // Run the function and collect all called signals.
//     const [result, signals] = collectSignals(this.fn);
//
//     // Start tracking for all dependencies' changes and re-compute the computed value.
//     signals.forEach(s => s.sub(this.update, true));
//     this.deps = signals;
//
//     return result;
//   }
//
//   get: Signal<T>['get'];
//   sub: Signal<T>['sub'];
//   unsub: Signal<T>['unsub'];
//   unsubAll: Signal<T>['unsubAll'];
//
//   /**
//    * Re-computes the internal value.
//    */
//   private update = (): void => {
//     this.signal.set(this.compute());
//   };
// }

export type Computed<T> = Omit<Signal<T>, 'set' | 'reset'>;

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
