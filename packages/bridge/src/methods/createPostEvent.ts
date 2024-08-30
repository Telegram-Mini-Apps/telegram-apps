import { isRecord } from '@telegram-apps/transformers';
import type { Version } from '@telegram-apps/types';

import { BridgeError } from '@/errors/BridgeError.js';
import {
  ERR_METHOD_PARAMETER_UNSUPPORTED,
  ERR_METHOD_UNSUPPORTED,
  type ErrorType,
} from '@/errors/errors.js';
import { supports } from '@/methods/supports.js';
import { type PostEventFn, postEvent } from '@/methods/postEvent.js';
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

export type CreatePostEventMode = 'strict' | 'non-strict';

/**
 * Creates a function which checks if specified method and parameters are supported.
 *
 * If method or parameters are unsupported, the `onUnsupported` function will be called.
 *
 * If `strict` or `non-strict` value was passed as the second argument, the function
 * will create its own `onUnsupported` function with behavior depending on the value passed.
 *
 * - Passing `strict` will make function to throw a `BridgeError` error
 * with `ERR_METHOD_UNSUPPORTED` or `ERR_METHOD_PARAMETER_UNSUPPORTED` type.
 * - Passing `non-strict` will just warn you about something being unsupported.
 *
 * @param version - Telegram Mini Apps version.
 * @param onUnsupportedOrMode - function or strict mode. Default: `strict`
 * @see BridgeError
 * @see ERR_METHOD_UNSUPPORTED
 * @see ERR_METHOD_PARAMETER_UNSUPPORTED
 */
export function createPostEvent(
  version: Version,
  onUnsupportedOrMode?: OnUnsupportedFn | CreatePostEventMode,
): PostEventFn {
  onUnsupportedOrMode ||= 'strict';
  const onUnsupported: OnUnsupportedFn = typeof onUnsupportedOrMode === 'function'
    ? onUnsupportedOrMode
    : data => {
      const { method, version } = data;
      let message: string;
      let error: ErrorType;

      if ('param' in data) {
        message = `Parameter "${data.param}" of "${method}" method is unsupported in Mini Apps version ${version}`;
        error = ERR_METHOD_PARAMETER_UNSUPPORTED;
      } else {
        message = `Method "${method}" is unsupported in Mini Apps version ${version}`;
        error = ERR_METHOD_UNSUPPORTED;
      }

      if (onUnsupportedOrMode === 'strict') {
        throw new BridgeError(error, message);
      }
      return console.warn(message);
    };

  return ((method: any, params: any) => {
    // Firstly, check if a method is supported.
    if (!supports(method, version)) {
      return onUnsupported({ version, method });
    }

    // Method could use parameters, which are supported only in specific versions of Mini Apps.
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
  }) as PostEventFn;
}
