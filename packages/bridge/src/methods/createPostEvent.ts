import type { Version } from '@telegram-apps/types';

import { createError } from '@/errors/createError.js';
import { ERR_METHOD_PARAMETER_UNSUPPORTED, ERR_METHOD_UNSUPPORTED } from '@/errors/errors.js';
import { isRecord } from '@/utils/isRecord.js';
import { supports } from '@/methods/supports.js';
import { type PostEvent, postEvent } from '@/methods/postEvent.js';
import type {
  MethodName,
  MethodNameWithVersionedParams,
  MethodVersionedParams,
} from '@/methods/types/index.js';

export type OnUnsupportedFn = (
  data: { version: Version } & (
    | { method: MethodName }
    | {
    [M in MethodNameWithVersionedParams]: {
      method: M;
      param: MethodVersionedParams<M>;
    };
  }[MethodNameWithVersionedParams]),
) => void;

/**
 * Creates a function which checks if specified method and parameters are supported.
 *
 * If method or parameters are unsupported, the `onUnsupported` function will be called.
 *
 * By default, the `onUnsupported` function will throw a `BridgeError` error with
 * `ERR_METHOD_UNSUPPORTED` or `ERR_METHOD_PARAMETER_UNSUPPORTED` type.
 * @param version - Telegram Mini Apps version.
 * @param onUnsupported - function which will be called, if a method or parameter is unsupported.
 * @see BridgeError
 * @see ERR_METHOD_UNSUPPORTED
 * @see ERR_METHOD_PARAMETER_UNSUPPORTED
 */
export function createPostEvent(
  version: Version,
  onUnsupported?: OnUnsupportedFn,
): PostEvent {
  onUnsupported ||= (data) => {
    const { method, version } = data;
    if ('param' in data) {
      throw createError(
        ERR_METHOD_PARAMETER_UNSUPPORTED,
        `Parameter "${data.param}" of "${method}" method is unsupported in Mini Apps version ${version}`,
      );
    }
    throw createError(
      ERR_METHOD_UNSUPPORTED,
      `Method "${method}" is unsupported in Mini Apps version ${version}`,
    );
  };

  return (method: any, params: any) => {
    // Firstly, check if a method is supported.
    if (!supports(method, version)) {
      return onUnsupported({ version, method });
    }

    // Method could use parameters, which are supported only in specific
    // versions of Mini Apps.
    // We are validating only those parameters, which are not backward compatible.
    if (
      isRecord(params)
      && method === 'web_app_set_header_color'
      && 'color' in params
      && !supports(method, 'color', version)
    ) {
      return onUnsupported({ version, method, param: 'color' });
    }

    return postEvent(method, params);
  };
}
