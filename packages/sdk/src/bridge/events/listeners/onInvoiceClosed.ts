import { createOn } from './createOn.js';
import { invoiceClosed } from '../parsers/invoiceClosed.js';

/**
 * Adds new event listener to the "invoice_closed" event.
 */
export const onInvoiceClosed = createOn('invoice_closed', invoiceClosed);
