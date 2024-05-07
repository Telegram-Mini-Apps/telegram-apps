import type { StateEvents } from '@/classes/State/types.js';

/**
 * QRScanner internal state.
 */
export interface QRScannerState {
  isOpened: boolean;
}

/**
 * QRScanner trackable events.
 */
export type QRScannerEvents = StateEvents<QRScannerState>;

/**
 * QRScanner event name.
 */
export type QRScannerEventName = keyof QRScannerEvents;

/**
 * QRScanner event listener.
 */
export type QRScannerEventListener<E extends QRScannerEventName> = QRScannerEvents[E];
