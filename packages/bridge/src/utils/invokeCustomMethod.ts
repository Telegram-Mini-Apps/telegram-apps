import { AbortablePromise } from 'better-promises';

import { captureSameReq } from '@/methods/captureSameReq.js';
import type { CustomMethodName, CustomMethodParams } from '@/methods/types/index.js';
import { InvokeCustomMethodError } from '@/errors.js';

import { request, type RequestOptions } from './request.js';

export type InvokeCustomMethodOptions = Omit<RequestOptions<'custom_method_invoked'>, 'capture'>;
export type InvokeCustomMethodFn = typeof invokeCustomMethod;

/**
 * Invokes known custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param requestId - request identifier.
 * @param options - additional options.
 * @throws {InvokeCustomMethodError} Invocation completed with some error.
 */
export function invokeCustomMethod<M extends CustomMethodName>(
  method: M,
  params: CustomMethodParams<M>,
  requestId: string,
  options?: InvokeCustomMethodOptions,
): AbortablePromise<unknown>;

/**
 * Invokes unknown custom method. Returns method execution result.
 * @param method - method name.
 * @param params - method parameters.
 * @param requestId - request identifier.
 * @param options - additional options.
 * @throws {InvokeCustomMethodError} Invocation completed with some error.
 */
export function invokeCustomMethod(
  method: string,
  params: object,
  requestId: string,
  options?: InvokeCustomMethodOptions,
): AbortablePromise<unknown>;

export function invokeCustomMethod(
  method: string,
  params: object,
  requestId: string,
  options?: InvokeCustomMethodOptions,
): AbortablePromise<unknown> {
  return request('web_app_invoke_custom_method', 'custom_method_invoked', {
    ...options || {},
    params: { method, params, req_id: requestId },
    capture: captureSameReq(requestId),
  })
    .then(({ result, error }) => {
      if (error) {
        throw new InvokeCustomMethodError(error);
      }
      return result;
    });
}
