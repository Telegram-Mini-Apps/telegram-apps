import { Computed } from './Computed/Computed.js';
import { Signal } from './Signal/Signal.js';

interface Overrides<T> {
  set?(this: Signal<T>, value: T): void;
}

export type ModifiedSignal<T> =
  & Signal<T>['get']
  & Pick<Signal<T>, 'set' | 'sub' | 'unsub' | 'unsubAll'>;

export type ModifiedComputed<T> =
  & Computed<T>['get']
  & Pick<Computed<T>, 'sub' | 'unsub' | 'unsubAll'>;

function modifySignal<T>(computed: Computed<T>): ModifiedComputed<T>;
function modifySignal<T>(signal: Signal<T>, overrides?: Overrides<T>): ModifiedSignal<T>;
function modifySignal<T>(
  signal: Signal<T> | Computed<T>,
  overrides?: Overrides<T>,
): ModifiedSignal<T> | ModifiedComputed<T> {
  overrides ||= {};

  function get(): T {
    return signal.get();
  }

  const props: ('sub' | 'unsub' | 'unsubAll' | 'get' | 'set')[] = ['sub', 'unsub', 'unsubAll', 'get'];
  if (signal instanceof Signal) {
    props.push('set');
  }

  props.forEach(prop => {
    Object.defineProperty(get, prop, {
      value: (prop in overrides ? (overrides as any)[prop] : (signal as any)[prop]).bind(signal),
      enumerable: true,
      writable: false,
    });
  });

  return get as ModifiedSignal<T> | ModifiedComputed<T>;
}

/**
 * Creates a simpler version of the Computed class instance.
 * @param fn - Computed initializer.
 */

/*@__NO_SIDE_EFFECTS__*/
export function createComputed<T>(fn: () => T): ModifiedComputed<T> {
  return modifySignal(new Computed(fn));
}

/**
 * Creates a simpler version of the Signal class instance.
 * @param value - initial value.
 * @param overrides - signal methods' overrides.
 */

/*@__NO_SIDE_EFFECTS__*/
export function createSignal<T>(value: T, overrides?: Overrides<T>): ModifiedSignal<T> {
  return modifySignal(new Signal(value), overrides);
}
