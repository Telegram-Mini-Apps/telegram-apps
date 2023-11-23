import type { RequestId } from '~/types/index.js';

interface CreateInvokeCustomMethodParams<M extends string, Params extends object> {
  /**
   * Unique request identifier.
   */
  req_id: RequestId;

  /**
   * Method name.
   */
  method: M;

  /**
   * Method specific parameters.
   */
  params: Params;
}

export type AnyInvokeCustomMethodParams =
  | CreateInvokeCustomMethodParams<'deleteStorageValues', { keys: string | string[] }>
  | CreateInvokeCustomMethodParams<'getStorageValues', { keys: string | string[] }>
  | CreateInvokeCustomMethodParams<'getStorageKeys', {}>
  | CreateInvokeCustomMethodParams<'saveStorageValue', { key: string, value: string }>
  | CreateInvokeCustomMethodParams<string, any>;
