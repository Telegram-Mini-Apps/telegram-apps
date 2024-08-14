import { request as bridgeRequest, type ExecuteWithOptions } from '@telegram-apps/bridge';

import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';

import { formatEvent, type FormatBiometryInfoResult } from './formatEvent.js';

const GET_INFO_METHOD = 'web_app_biometry_get_info';

/**
 * Requests biometry information.
 * @param options - additional execution options.
 */
export const request: WithIsSupported<(options?: ExecuteWithOptions) => Promise<FormatBiometryInfoResult>> =
  decorateWithIsSupported(async (options) => {
    return formatEvent(
      await bridgeRequest({
        ...options || {},
        method: GET_INFO_METHOD,
        event: 'biometry_info_received',
      }),
    );
  }, GET_INFO_METHOD);

export type * from './types.js';
