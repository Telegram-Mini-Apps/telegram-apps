import { json } from '../../../parsing/parsers/json.js';
import { string } from '../../../parsing/parsers/string.js';

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
