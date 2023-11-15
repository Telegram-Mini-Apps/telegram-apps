import { json, string } from '@tma.js/parsing';

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
