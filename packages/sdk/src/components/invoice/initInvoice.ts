import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';

import { Invoice } from './Invoice.js';

/**
 * @returns A new initialized instance of the `Invoice` class.
 * @see Invoice
 */
export const initInvoice = createInitFn<Invoice, 'version'>(
  ({ version, postEvent }) => new Invoice(false, version, postEvent),
);
