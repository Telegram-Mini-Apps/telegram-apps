import {
  computed,
  type Computed,
  type Signal,
  signal,
  type SignalOptions,
} from '@telegram-apps/signals';

const signals: (Signal<any> | Computed<any>)[] = [];

/**
 * Creates a new signal with initial value.
 * @param initialValue - initial value.
 * @param options - additional options.
 */
export function createSignal<T>(
  initialValue: T,
  options?: SignalOptions<T>,
): Signal<T>;

/**
 * Creates a new signal without initial value.
 * @param initialValue
 * @param options - additional options.
 */
export function createSignal<T>(
  initialValue?: T,
  options?: SignalOptions<T | undefined>,
): Signal<T | undefined>;

// #__NO_SIDE_EFFECTS__
export function createSignal<T>(
  initialValue?: T,
  options?: SignalOptions<T | undefined>,
): Signal<T | undefined> {
  const s = signal(initialValue, options);
  signals.push(s);
  return s;
}

/**
 * Creates a signal, which wil be automatically updated if some of its dependant signals were
 * modified.
 * @param fn - computation function.
 * @param options - additional functions.
 */
// #__NO_SIDE_EFFECTS__
export function createComputed<T>(
  fn: (prev?: T) => T,
  options?: SignalOptions<T>,
): Computed<T> {
  const s = computed(fn, options);
  signals.push(s);
  return s;
}

/**
 * Resets all signals states.
 */
export function resetSignals() {
  signals.forEach(s => {
    s.unsubAll();
    'reset' in s && s.reset();
  });
}