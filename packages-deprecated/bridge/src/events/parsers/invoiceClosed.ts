import { json, string } from '@tma.js/parsing';

export type InvoiceStatus =
  | 'paid'
  | 'failed'
  | 'pending'
  | 'cancelled'
  | string;

export interface InvoiceClosedPayload {
  /**
   * Passed during the `web_app_open_invoice` method invocation `slug` value.
   */
  slug: string;
  /**
   * Invoice status
   */
  status: InvoiceStatus;
}

export function invoiceClosed() {
  return json<InvoiceClosedPayload>({
    slug: string(),
    status: string(),
  });
}
