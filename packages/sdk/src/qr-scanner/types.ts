import type { StateEvents } from '../state/index.js';

export interface QRScannerState {
  isOpened: boolean;
}

export type QRScannerEvents = StateEvents<QRScannerState>;

export type QRScannerEventName = keyof QRScannerEvents;

export type QRScannerEventListener<E extends QRScannerEventName> = QRScannerEvents[E];
