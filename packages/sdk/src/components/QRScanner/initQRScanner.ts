import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';

import { QRScanner } from './QRScanner.js';

/**
 * @returns A new initialized instance of the `QRScanner` class.
 * @see QRScanner
 */
export const initQRScanner = createInitFn<QRScanner, 'version'>(
  ({ version, postEvent }) => new QRScanner(false, version, postEvent),
);
