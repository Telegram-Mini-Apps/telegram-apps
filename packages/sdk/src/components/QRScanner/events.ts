/**
 * Information about events supported by QRScanner.
 */
interface QRScannerEventsMap {
  /**
   * Open state changed.
   * @param isOpened - current state.
   */
  openChanged: (isOpened: boolean) => void;
}

/**
 * Known QRScanner event name.
 */
type QRScannerEventName = keyof QRScannerEventsMap;

/**
 * Listener for specified QRScanner event.
 */
type QRScannerEventListener<E extends QRScannerEventName> = QRScannerEventsMap[E];

export {QRScannerEventName, QRScannerEventsMap, QRScannerEventListener};