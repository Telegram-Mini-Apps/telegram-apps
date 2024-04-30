import { createComponentInitFn } from '@/init/createComponentInitFn/createComponentInitFn.js';

import { QRScanner } from './QRScanner.js';

/**
 * @returns A new initialized instance of the `QRScanner` class.
 * @see QRScanner
 */
export const initQRScanner = createComponentInitFn<QRScanner, 'version'>(
  ({ version, postEvent }) => new QRScanner(false, version, postEvent),
);
