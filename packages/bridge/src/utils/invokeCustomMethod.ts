import { CancelablePromise, TypedError } from '@telegram-apps/toolkit';

import { ERR_CUSTOM_METHOD_ERR_RESPONSE } from '@/errors.js';
import { captureSameReq } from '@/methods/captureSameReq.js';
import type { ExecuteWithOptions } from '@/types.js';
import type { CustomMethodName, CustomMethodParams } from '@/methods/types/index.js';

import { request } from './request.js';

/**
 * Invokes known custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param requestId - request identifier.
 * @param options - additional options.
 * @throws {TypedError} ERR_CUSTOM_METHOD_ERR_RESPONSE
 */
export function invokeCustomMethod<M extends CustomMethodName>(
  method: M,
  params: CustomMethodParams<M>,
  requestId: string,
  options?: ExecuteWithOptions,
): CancelablePromise<unknown>;

/**
 * Invokes unknown custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param requestId - request identifier.
 * @param options - additional options.
 * @throws {TypedError} ERR_CUSTOM_METHOD_ERR_RESPONSE
 */
export function invokeCustomMethod(
  method: string,
  params: object,
  requestId: string,
  options?: ExecuteWithOptions,
): CancelablePromise<unknown>;

export function invokeCustomMethod(
  method: string,
  params: object,
  requestId: string,
  options?: ExecuteWithOptions,
): CancelablePromise<unknown> {
  return request('web_app_invoke_custom_method', 'custom_method_invoked', {
    ...options || {},
    params: { method, params, req_id: requestId },
    capture: captureSameReq(requestId),
  })
    .then(({ result, error }) => {
      if (error) {
        throw new TypedError(ERR_CUSTOM_METHOD_ERR_RESPONSE, error);
      }
      return result;
    });
}
