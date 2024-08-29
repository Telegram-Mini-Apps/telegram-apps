import { $eventSignalsCache } from '@/events/listening/signalFor.js';
import { $lastEvent, $lastEventCleanup } from '@/events/lastEvent.js';
import { $targetOrigin } from '@/methods/$targetOrigin.js';
import { $_debug } from '@/debug.js';

/**
 * Resets the package state.
 */
export function resetPackageState() {
  // Globally bound event listeners.
  Object.values($eventSignalsCache()).forEach(s => s.destroy());
  $eventSignalsCache.reset();
  $eventSignalsCache.destroy();

  // Last event signals.
  // Perform cleanup: remove window listeners.
  $lastEventCleanup()?.();
  $lastEvent.reset();
  $lastEvent.destroy();
  $lastEventCleanup.reset();

  // Methods signals.
  $targetOrigin.reset();

  // Misc.
  $_debug.reset();
}