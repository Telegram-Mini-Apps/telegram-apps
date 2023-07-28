export interface QRScannerEvents {
  isOpenedChanged: (isOpened: boolean) => void;
}

export type QRScannerEventName = keyof QRScannerEvents;

export type QRScannerEventListener<E extends QRScannerEventName> =
  QRScannerEvents[E];
