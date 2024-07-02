import type { StateEvents } from '@/classes/State/types.js';
import { RequestCapture } from '@/bridge/request.js';

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

export interface QRScannerOpenOptions {
  /**
   * Title to be displayed.
   */
  text?: string;
  /**
   * Function, which should return true, if QR should be captured.
   */
  capture?: RequestCapture<'qr_text_received'>;
}
