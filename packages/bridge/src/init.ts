import {Bridge, BridgeProps} from './Bridge';

export type InitOptions = BridgeProps;

/**
 * Initializes default version of Bridge instance applying additional
 * Bridge-required lifecycle logic. It is recommended to use this function
 * instead of usual Bridge constructor to make sure, created instance will
 * work appropriately.
 * @param options - init options.
 * @deprecated Use Bridge.init()
 */
export function init(options: InitOptions = {}): Bridge {
  return Bridge.init(options);
}

