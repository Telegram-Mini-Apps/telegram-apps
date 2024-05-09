import { createError } from '@/errors/createError.js';
import { ERR_INVOKE_CUSTOM_METHOD_RESPONSE } from '@/errors/errors.js';
import type { ExecuteWithOptions } from '@/types/index.js';

import { captureSameReq } from './captureSameReq.js';
import { request } from './request.js';
import type { CustomMethodName, CustomMethodParams } from '../methods/types/custom-methods.js';

/**
 * Invokes known custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param requestId - request identifier.
 * @param options - additional options.
 * @throws {SDKError} ERR_INVOKE_CUSTOM_METHOD_RESPONSE
 * @see ERR_INVOKE_CUSTOM_METHOD_RESPONSE
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
 * @throws {SDKError} ERR_INVOKE_CUSTOM_METHOD_RESPONSE
 * @see ERR_INVOKE_CUSTOM_METHOD_RESPONSE
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
  } = await request({
    ...options,
    method: 'web_app_invoke_custom_method',
    event: 'custom_method_invoked',
    params: {
      method,
      params,
      req_id: requestId,
    },
    capture: captureSameReq(requestId),
  });

  if (error) {
    throw createError(ERR_INVOKE_CUSTOM_METHOD_RESPONSE, error);
  }

  return result;
}
