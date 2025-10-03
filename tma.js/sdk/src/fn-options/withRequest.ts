import type { RequestFpFn } from '@tma.js/bridge';

import { createFnOption } from '@/fn-options/createFnOption.js';
import { requestFp } from '@/globals/request.js';

export interface WithRequest {
  /**
   * A request function to use to call Mini Apps methods.
   */
  request: RequestFpFn;
}

export const withRequest = createFnOption<WithRequest>({
  request: requestFp,
});
