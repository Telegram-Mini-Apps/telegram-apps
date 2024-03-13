import { json } from '../../../parsing/parsers/json.js';
import { string } from '../../../parsing/parsers/string.js';

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
