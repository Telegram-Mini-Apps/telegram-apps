import { json, string } from '@tma.js/parsing';

export type PhoneRequestedStatus = 'sent' | string;

export interface PhoneRequestedPayload {
  /**
   * Request status.
   */
  status: PhoneRequestedStatus;
}

export function phoneRequested() {
  return json<PhoneRequestedPayload>({ status: string() });
}
