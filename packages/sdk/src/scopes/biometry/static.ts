import type { ExecuteWithOptions, CancelablePromise } from '@telegram-apps/bridge';

import { request as _request } from '@/scopes/globals/globals.js';
import { withIsSupported } from '@/scopes/withIsSupported.js';

import { eventToState } from './eventToState.js';
import type { State } from './types.js';

const GET_INFO_METHOD = 'web_app_biometry_get_info';

/**
 * Requests biometry information.
 * @param options - additional execution options.
 */
export const request = withIsSupported(
  (options?: ExecuteWithOptions): CancelablePromise<State> => {
    return _request(GET_INFO_METHOD, 'biometry_info_received', options).then(eventToState);
  }, GET_INFO_METHOD,
);

export type * from './types.js';
