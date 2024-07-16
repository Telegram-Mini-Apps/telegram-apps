import type { TrackReactiveUnitFn } from '@/reactivity/types.js';

let reactiveTrackers: Set<TrackReactiveUnitFn<any>> | undefined;

export function registerReactiveUnitUsage(trackReactiveUnit: TrackReactiveUnitFn<any>): void {
  if (reactiveTrackers) {
    reactiveTrackers.add(trackReactiveUnit);
  }
}

/**
 * Runs the specified function in reactive context, collecting called reactive units.
 * @param fn - function to call.
 */
export function runInReactiveContext<T>(fn: () => T): [
  /**
   * Function execution result.
   */
  result: T,
  /**
   * List of collected reactive unit trackers.
   */
  trackers: TrackReactiveUnitFn<unknown>[],
] {
  reactiveTrackers = new Set();

  try {
    // Call the function and start tracking for all captured reactive units.
    return [fn(), [...reactiveTrackers.values()]];
  } finally {
    // Remember to untrack the reactive context.
    reactiveTrackers = new Set();
  }
}
