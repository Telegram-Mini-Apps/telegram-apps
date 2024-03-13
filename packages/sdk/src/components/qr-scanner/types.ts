import type { StateEvents } from '../../state/types.js';

export interface QRScannerState {
  isOpened: boolean;
}

export type QRScannerEvents = StateEvents<QRScannerState>;

export type QRScannerEventName = keyof QRScannerEvents;

export type QRScannerEventListener<E extends QRScannerEventName> = QRScannerEvents[E];
