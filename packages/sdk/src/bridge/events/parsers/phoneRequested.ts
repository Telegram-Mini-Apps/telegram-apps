import { json, string } from '~/parsing/index.js';

export type PhoneRequestedStatus = 'sent' | 'cancelled' | string;

export interface PhoneRequestedPayload {
  /**
   * Request status.
   */
  status: PhoneRequestedStatus;
}

export function phoneRequested() {
  return json<PhoneRequestedPayload>({ status: string() });
}
