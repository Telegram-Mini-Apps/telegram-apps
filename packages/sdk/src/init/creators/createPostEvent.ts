import {
  supports,
  postEvent as defaultPostEvent,
  detectSupportParams,
  type PostEvent,
} from '@tma.js/bridge';
import { isRecord } from '@tma.js/utils';

import { MethodNotSupportedError, ParameterUnsupportedError } from '../../errors/index.js';

/**
 * Creates postEvent function.
 * @param checkCompat - should compatibility check be enabled.
 * @param version - platform version.
 */
export function createPostEvent(checkCompat: boolean, version: string): PostEvent {
  return checkCompat
    ? (method: any, params: any) => {
      // Firstly, check if method itself is supported.
      if (!supports(method, version)) {
        throw new MethodNotSupportedError(method, version);
      }

      // Method could use parameters, which are supported only in specific versions of TWA.
      if (isRecord(params)) {
        detectSupportParams(method, params).forEach((param) => {
          if (!supports(method as any, param, version)) {
            throw new ParameterUnsupportedError(method, param, version);
          }
        });
      }

      return defaultPostEvent(method, params);
    }
    : defaultPostEvent;
}
