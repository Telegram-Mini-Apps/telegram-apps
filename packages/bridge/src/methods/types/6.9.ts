import type { CreateParams } from './utils.js';

interface CreateInvokeCustomMethodParams<M extends string, Params extends object> {
  /**
   * Unique request identifier.
   */
  req_id: string;
  /**
   * Method name.
   */
  method: M;
  /**
   * Method specific parameters.
   */
  params: Params;
}

export interface CustomMethodsParams {
  /**
   * Deletes storage values by their keys.
   */
  deleteStorageValues: {
    keys: string | string[]
  };
  /**
   * Gets current user contact in case, Mini has access to it.
   */
  getRequestedContact: {};
  /**
   * Gets all registered storage keys.
   */
  getStorageKeys: {};
  /**
   * Gets storage values by their keys.
   */
  getStorageValues: {
    keys: string | string[]
  };
  /**
   * Saves value by specified key in the storage.
   */
  saveStorageValue: {
    key: string;
    value: string;
  };
}

/**
 * Known custom method name.
 */
export type CustomMethodName = keyof CustomMethodsParams;

/**
 * Custom method parameters.
 */
export type CustomMethodParams<M extends CustomMethodName> = CustomMethodsParams[M];

export type AnyInvokeCustomMethodParams =
  | CreateInvokeCustomMethodParams<string, any>
  | {
  [M in CustomMethodName]: CreateInvokeCustomMethodParams<M, CustomMethodParams<M>>
}[CustomMethodName];

export interface Methods69 {
  /**
   * Invokes custom method.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-invoke-custom-method
   */
  web_app_invoke_custom_method: CreateParams<AnyInvokeCustomMethodParams>;
  /**
   * Requests access to current user's phone.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-request-phone
   */
  web_app_request_phone: CreateParams;
  /**
   * Requests write message access to the current user.
   * @since v6.9
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-rqeuest-write-access
   */
  web_app_request_write_access: CreateParams;
}