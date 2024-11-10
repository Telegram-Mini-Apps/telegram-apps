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
   * Returns current server time.
   */
  getCurrentTime: {};
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