export type InvoiceStatus =
  | 'paid'
  | 'failed'
  | 'pending'
  | 'cancelled'
  | string;

export type PhoneRequestedStatus = 'sent' | 'cancelled' | string;

export type WriteAccessRequestedStatus = 'allowed' | string;

export type BiometryType = 'finger' | 'face' | string;

export type BiometryTokenUpdateStatus = 'updated' | 'removed' | 'failed' | string;

export type BiometryAuthRequestStatus = 'failed' | 'authorized' | string;