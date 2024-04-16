import { createError } from '@/errors/createError.js';
import { ERROR_INVOKE_CUSTOM_METHOD_RESPONSE } from '@/errors/errors.js';
import type { ExecuteWithOptions } from '@/types/methods.js';

import { captureSameReq } from './captureSameReq.js';
import type { CustomMethodName, CustomMethodParams } from './methods/types/custom-methods.js';
import { request } from './request.js';

/**
 * Invokes known custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param requestId - request identifier.
 * @param options - additional options.
 * @throws {SDKError} ERROR_INVOKE_CUSTOM_METHOD_RESPONSE
 * @see ERROR_INVOKE_CUSTOM_METHOD_RESPONSE
 */
export async function invokeCustomMethod<M extends CustomMethodName>(
  method: M,
  params: CustomMethodParams<M>,
  requestId: string,
  options?: ExecuteWithOptions,
): Promise<unknown>;

/**
 * Invokes unknown custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param requestId - request identifier.
 * @param options - additional options.
 * @throws {SDKError} ERROR_INVOKE_CUSTOM_METHOD_RESPONSE
 * @see ERROR_INVOKE_CUSTOM_METHOD_RESPONSE
 */
export function invokeCustomMethod(
  method: string,
  params: object,
  requestId: string,
  options?: ExecuteWithOptions,
): Promise<unknown>;

export async function invokeCustomMethod(
  method: string,
  params: object,
  requestId: string,
  options: ExecuteWithOptions = {},
): Promise<unknown> {
  const {
    result,
    error,
  } = await request('web_app_invoke_custom_method', 'custom_method_invoked', {
    ...options,
    params: {
      method,
      params,
      req_id: requestId,
    },
    capture: captureSameReq(requestId),
  });

  if (error) {
    throw createError(ERROR_INVOKE_CUSTOM_METHOD_RESPONSE, error);
  }

  return result;
}
