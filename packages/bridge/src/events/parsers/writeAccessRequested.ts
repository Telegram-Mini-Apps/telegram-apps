import { json, string } from '@tma.js/parsing';

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
