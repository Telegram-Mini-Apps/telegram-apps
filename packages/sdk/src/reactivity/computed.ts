import { runInReactiveContext } from '@/reactivity/context.js';
import { signal } from '@/reactivity/signal.js';
import type {
  CleanupFn,
  TrackReactiveUnitFn,
  UntrackReactiveUnitFn,
} from '@/reactivity/types.js';

/**
 * Represents a computed value.
 */
export type Computed<T> = [
  /**
   * Returns the underlying value.
   */
  get: () => T,
  /**
   * Adds a new listener, tracking changes.
   */
  track: TrackReactiveUnitFn<T>,
  /**
   * Removes a listener, tracking changes.
   */
  untrack: UntrackReactiveUnitFn<T>,
  /**
   * Removes all listeners.
   */
  untrackAll: () => void,
];

/**
 * Creates a new computed value which updates each time, some of the dependant signals or memos
 * changed.
 * @param fn - function to memoize.
 */
export function computed<T>(fn: () => T): Computed<T> {
  const untrackers: CleanupFn[] = [];
  const [get, set, track, untrack, untrackAll] = signal<T>(compute());

  function update() {
    set(compute());
  }

  function compute(): T {
    // As long as in this iteration, we may receive new signals as dependencies, we remove all
    // previously added reactive unit trackers.
    untrackers.forEach(ut => ut());

    // Run the function in reactive context, so we could know the memo reactive dependencies.
    const [result, trackers] = runInReactiveContext(fn);

    // Start tracking for all dependencies' changes and re-compute the memo.
    untrackers.push(...trackers.map(t => t(update)));

    return result;
  }

  return [get, track, untrack, untrackAll];
}
