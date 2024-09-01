import { request as bridgeRequest, type ExecuteWithOptions } from '@telegram-apps/bridge';
import type { BetterPromise } from '@telegram-apps/toolkit';

import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';

import { formatEvent } from './formatEvent.js';
import { State } from './types.js';

const GET_INFO_METHOD = 'web_app_biometry_get_info';

/**
 * Requests biometry information.
 * @param options - additional execution options.
 */
export const request: WithIsSupported<(options?: ExecuteWithOptions) => BetterPromise<State>> =
  decorateWithIsSupported((options) => {
    return bridgeRequest(GET_INFO_METHOD, 'biometry_info_received', options).then(formatEvent);
  }, GET_INFO_METHOD);

export type * from './types.js';
