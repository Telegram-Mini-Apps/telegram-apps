import { Signal } from '@/signals/Signal/Signal.js';
import { Computed } from '@/signals/Computed/Computed.js';

interface Overrides<T> {
  set?(this: Signal<T>, value: T): void;
}

export type ModifiedSignal<T> =
  & Signal<T>['get']
  & Pick<Signal<T>, 'set' | 'subscribe' | 'unsubscribe' | 'unsubscribeAll'>;

function modifySignal<T>(signal: Signal<T>, overrides?: Overrides<T>): ModifiedSignal<T> {
  overrides ||= {};

  function get(): T {
    return signal.get();
  }

  (['set', 'subscribe', 'unsubscribe', 'unsubscribeAll'] as const).forEach(prop => {
    Object.defineProperty(get, prop, {
      value: (prop in overrides ? (overrides as any)[prop] : (signal as any)[prop]).bind(signal),
      enumerable: true,
      writable: false,
    });
  });

  return get as ModifiedSignal<T>;
}

/**
 * Creates a simpler version of the Computed class instance.
 * @param fn - Computed initializer.
 */
export function createComputed<T>(fn: () => T): ModifiedSignal<T> {
  return modifySignal(new Computed(fn));
}

/**
 * Creates a simpler version of the Signal class instance.
 * @param value - initial value.
 * @param overrides - signal methods' overrides.
 */
export function createSignal<T>(value: T, overrides?: Overrides<T>): ModifiedSignal<T> {
  return modifySignal(new Signal(value), overrides);
}
