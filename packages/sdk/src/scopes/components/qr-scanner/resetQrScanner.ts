import { resetSignal } from '@test-utils/reset.js';

import { isOpened } from './qr-scanner.js';

export function resetQrScanner() {
  [isOpened].forEach(resetSignal);
}