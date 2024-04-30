import { request } from '@/bridge/utils/request.js';
import type { ExecuteWithOptions } from '@/types/index.js';

import { formatBiometryInfoEvent } from './formatBiometryInfoEvent.js';
import type { FormatBiometryInfoResult } from './formatBiometryInfoEvent.js';

/**
 * Requests biometry information.
 * @param options - additional execution options.
 */
export async function requestBiometryInfo(
  options?: ExecuteWithOptions,
): Promise<FormatBiometryInfoResult> {
  return formatBiometryInfoEvent(
    await request({
      ...(options || {}),
      method: 'web_app_biometry_get_info',
      event: 'biometry_info_received',
    }),
  );
}
