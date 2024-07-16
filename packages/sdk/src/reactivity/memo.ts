import { registerReactiveUnitUsage, runInReactiveContext } from '@/reactivity/context.js';
import { signal } from '@/reactivity/signal.js';
import type {
  RemoveListenerFn,
  TrackReactiveUnitFn,
  UntrackReactiveUnitFn,
} from '@/reactivity/types.js';

/**
 * Represents a computed value.
 */
export type Memo<T> = [
  /**
   * Returns the underlying memo value.
   */
  get: () => T,
  /**
   * Adds a new listener, tracking the memo changes.
   */
  track: TrackReactiveUnitFn<T>,
  /**
   * Removes a listener, tracking the memo changes.
   */
  untrack: UntrackReactiveUnitFn<T>,
];

/**
 * Creates a new computed value which updates each time, some of the dependant signals or memos
 * changed.
 * @param fn - function to memoize.
 */
export function memo<T>(fn: () => T): Memo<T> {
  const untrackers: RemoveListenerFn[] = [];
  const [get, set, track, untrack] = signal<T>(compute());

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

  return [
    function getMemo() {
      registerReactiveUnitUsage(track);
      return get();
    },
    track,
    untrack,
  ];
}
