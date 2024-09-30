import type { Signal } from '@telegram-apps/signals';

import { $eventSignalsCache } from '@/events/listening/signalFor.js';
import { $lastEvent, $lastEventCleanup } from '@/events/listening/lastEvent.js';
import { $targetOrigin } from '@/methods/$targetOrigin.js';
import { $debug } from '@/debug.js';

function resetSignal(s: Signal<any>): void {
  s.unsubAll();
  s.reset();
}

/**
 * Resets the package state. Normally, you don't use this function in your application.
 * We are using it only for test purposes.
 */
export function resetPackageState() {
  $lastEventCleanup()?.();

  [
    ...Object.values($eventSignalsCache()),
    $eventSignalsCache,
    $lastEvent,
    $lastEventCleanup,
    $targetOrigin,
    $debug,
  ].forEach(resetSignal);
}