/**
 * Information about events supported by QRScanner.
 */
export interface QRScannerEventsMap {
  /**
   * Open state changed.
   * @param isOpened - current state.
   */
  openChanged: (isOpened: boolean) => void;
}

/**
 * Known QRScanner event name.
 */
export type QRScannerEventName = keyof QRScannerEventsMap;

/**
 * Listener for specified QRScanner event.
 */
export type QRScannerEventListener<E extends QRScannerEventName> =
  QRScannerEventsMap[E];