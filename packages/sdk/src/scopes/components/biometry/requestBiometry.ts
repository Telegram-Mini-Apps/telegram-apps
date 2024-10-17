import type { ExecuteWithOptions, CancelablePromise } from '@telegram-apps/bridge';

import { request } from '@/scopes/globals.js';
import { withIsSupported } from '@/scopes/toolkit/withIsSupported.js';

import { eventToState } from './eventToState.js';
import type { State } from './types.js';

const WEB_APP_BIOMETRY_GET_INFO = 'web_app_biometry_get_info';

/**
 * Requests biometry information.
 * @param options - additional execution options.
 */
export const requestBiometry = withIsSupported(
  (options?: ExecuteWithOptions): CancelablePromise<State> => {
    return request(WEB_APP_BIOMETRY_GET_INFO, 'biometry_info_received', options).then(eventToState);
  }, WEB_APP_BIOMETRY_GET_INFO,
);
