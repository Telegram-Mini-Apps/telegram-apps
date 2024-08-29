/**
 * Returns the first navigation entry from window.performance.
 * @returns First navigation entry or null, in case performance functionality is not supported
 * or navigation entry was not found.
 */
export function getFirstNavigationEntry(): PerformanceNavigationTiming | undefined {
  return performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
}
