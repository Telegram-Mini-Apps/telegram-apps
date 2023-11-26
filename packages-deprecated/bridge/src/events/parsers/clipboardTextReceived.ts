import { json, string } from '@tma.js/parsing';

import type { RequestId } from '../../shared.js';

export interface ClipboardTextReceivedPayload {
  /**
   * Passed during the `web_app_read_text_from_clipboard` method invocation `req_id` value.
   */
  req_id: RequestId;

  /**
   * Data extracted from the clipboard. The returned value will have the type `string` only in
   * the case, application has access to the clipboard.
   */
  data?: string | null;
}

export function clipboardTextReceived() {
  return json<ClipboardTextReceivedPayload>({
    req_id: string(),
    data: (value) => (
      value === null
        ? value
        : string().optional().parse(value)
    ),
  });
}
