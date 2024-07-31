import { request as bridgeRequest } from '@/bridge/request.js';
import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import type { ExecuteWithOptions } from '@/types/index.js';

import { formatEvent, type FormatBiometryInfoResult } from './formatEvent.js';

const GET_INFO_METHOD = 'web_app_biometry_get_info';

/**
 * Requests biometry information.
 * @param options - additional execution options.
 */
const request: WithIsSupported<(options?: ExecuteWithOptions) => Promise<FormatBiometryInfoResult>> =
  decorateWithIsSupported(async (options) => {
    return formatEvent(
      await bridgeRequest({
        ...options || {},
        method: 'web_app_biometry_get_info',
        event: 'biometry_info_received',
      }),
    );
  }, GET_INFO_METHOD);

export {
  request,
};
