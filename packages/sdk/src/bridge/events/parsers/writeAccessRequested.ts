import { json } from '../../../parsing/parsers/json.js';
import { string } from '../../../parsing/parsers/string.js';

export type WriteAccessRequestedStatus = 'allowed' | string;

export interface WriteAccessRequestedPayload {
  /**
   * Request status.
   */
  status: WriteAccessRequestedStatus;
}

export function writeAccessRequested() {
  return json<WriteAccessRequestedPayload>({ status: string() });
}
