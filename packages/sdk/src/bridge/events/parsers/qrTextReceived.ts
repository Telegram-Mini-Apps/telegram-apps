import { json, string } from '../../../parsing/index.js';

export interface QrTextReceivedPayload {
  /**
   * Data extracted from the QR.
   */
  data?: string;
}

export function qrTextReceived() {
  return json<QrTextReceivedPayload>({
    data: string().optional(),
  });
}
