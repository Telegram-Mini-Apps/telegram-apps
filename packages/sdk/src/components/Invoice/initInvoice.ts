import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

import { Invoice } from './Invoice.js';

/**
 * @returns A new initialized instance of the `Invoice` class.
 * @see Invoice
 */
export const initInvoice = createComponentInitFn(
  ({ version, postEvent }) => new Invoice(false, version, postEvent),
);
