import type * as TE from 'fp-ts/TaskEither';
import type {
  CustomMethodParams,
  CustomMethodName,
  InvokeCustomMethodError,
  InvokeCustomMethodFpOptions,
  RequestError,
} from '@tma.js/bridge';

import { invokeCustomMethod } from '@/globals/invokeCustomMethod.js';
import { createFnOption } from '@/fn-options/createFnOption.js';

export interface InvokeCustomMethodNoRequestIdFn {
  <M extends CustomMethodName>(
    this: void,
    method: M,
    params: CustomMethodParams<M>,
    options?: InvokeCustomMethodFpOptions,
  ): TE.TaskEither<InvokeCustomMethodError, unknown>;

  (
    this: void,
    method: string,
    params: object,
    options?: InvokeCustomMethodFpOptions,
  ): TE.TaskEither<RequestError, unknown>;
}

export interface WithInvokeCustomMethod {
  invokeCustomMethod: InvokeCustomMethodNoRequestIdFn;
}

export const withInvokeCustomMethod = createFnOption<WithInvokeCustomMethod>({
  invokeCustomMethod,
});
