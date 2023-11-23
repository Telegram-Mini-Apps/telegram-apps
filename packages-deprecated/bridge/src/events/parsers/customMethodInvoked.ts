import { json, string } from '@tma.js/parsing';

import type { RequestId } from '../../shared.js';

export interface CustomMethodInvokedPayload<R = unknown> {
  /**
   * Unique identifier of this invocation.
   */
  req_id: RequestId;
  /**
   * Method invocation successful result.
   */
  result?: R;
  /**
   * Method invocation error code.
   */
  error?: string;
}

export function customMethodInvoked() {
  return json<CustomMethodInvokedPayload>({
    req_id: string(),
    result: (value) => value,
    error: string().optional(),
  });
}
