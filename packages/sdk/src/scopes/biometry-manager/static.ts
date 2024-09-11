import { request as bridgeRequest, type ExecuteWithOptions } from '@telegram-apps/bridge';
import type { CancelablePromise } from '@telegram-apps/toolkit';

import { withIsSupported, type WithIsSupported } from '@/scopes/withIsSupported.js';

import { eventToState } from './eventToState.js';
import { State } from './types.js';

const GET_INFO_METHOD = 'web_app_biometry_get_info';

/**
 * Requests biometry information.
 * @param options - additional execution options.
 */
export const request: WithIsSupported<(options?: ExecuteWithOptions) => CancelablePromise<State>> =
  withIsSupported((options) => {
    return bridgeRequest(GET_INFO_METHOD, 'biometry_info_received', options).then(eventToState);
  }, GET_INFO_METHOD);

export type * from './types.js';
