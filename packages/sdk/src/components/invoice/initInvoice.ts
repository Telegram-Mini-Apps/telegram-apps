import { createInitFn } from '@/components/createInitFn.js';
import { Invoice } from '@/components/invoice/Invoice.js';

/**
 * @returns A new initialized instance of Invoice class.
 */
export const initInvoice = createInitFn('invoice', (
  { version, postEvent },
  { isOpened = false },
) => new Invoice(isOpened, version, postEvent));
