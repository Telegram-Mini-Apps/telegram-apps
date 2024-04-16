import { createInitFn } from '@/components/createInitFn.js';
import { QRScanner } from '@/components/qr-scanner/QRScanner.js';

/**
 * @returns A new initialized instance of QRScanner class.
 */
export const initQRScanner = createInitFn('qrScanner', (
  { version, postEvent },
  { isOpened = false },
) => new QRScanner(isOpened, version, postEvent));
