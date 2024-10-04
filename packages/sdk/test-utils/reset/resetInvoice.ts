import { resetSignal } from '@test-utils/reset/reset.js';

import { isOpened } from '@/scopes/components/invoice/invoice.js';

export function resetInvoice() {
  [isOpened].forEach(resetSignal);
}