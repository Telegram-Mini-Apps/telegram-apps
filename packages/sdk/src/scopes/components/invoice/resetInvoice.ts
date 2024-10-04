import { resetSignal } from '@test-utils/reset.js';

import { isOpened } from './invoice.js';

export function resetInvoice() {
  [isOpened].forEach(resetSignal);
}