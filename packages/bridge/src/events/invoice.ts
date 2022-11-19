export type InvoiceStatus =
  | 'paid'
  | 'failed'
  | 'pending'
  | 'cancelled'
  | string;

/**
 * @see https://corefork.telegram.org/api/bots/webapps#invoice-closed
 */
export interface InvoiceClosedPayload {
  slug: string;
  status: InvoiceStatus;
}