import { resetSignal } from '@test-utils/reset/reset.js';

import { isOpened } from '@/scopes/components/qr-scanner/qr-scanner.js';

export function resetQrScanner() {
  [isOpened].forEach(resetSignal);
}