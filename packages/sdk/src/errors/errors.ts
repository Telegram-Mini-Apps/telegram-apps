/**
 * Specified Mini Apps method is unsupported.
 */
export const ERROR_METHOD_UNSUPPORTED = 'ERROR_METHOD_UNSUPPORTED';

/**
 * Specified Mini Apps method parameter is unsupported.
 */
export const ERROR_METHOD_PARAMETER_UNSUPPORTED = 'ERROR_METHOD_PARAMETER_UNSUPPORTED';

/**
 * Current environment is not Telegram application.
 */
export const ERROR_UNKNOWN_ENV = 'ERROR_UNKNOWN_ENV';

/**
 * Telegram application returned and error while invoking custom method.
 */
export const ERROR_INVOKE_CUSTOM_METHOD_RESPONSE = 'ERROR_INVOKE_CUSTOM_METHOD_RESPONSE';

/**
 * Timeout reached.
 */
export const ERROR_TIMED_OUT = 'ERROR_TIMED_OUT';

/**
 * Value has unexpected type.
 */
export const ERROR_UNEXPECTED_TYPE = 'ERROR_UNEXPECTED_TYPE';

/**
 * Something went wrong during value parsing.
 */
export const ERROR_PARSE = 'ERROR_PARSE';

/**
 * Navigation entries list is empty.
 */
export const ERROR_NAVIGATION_HISTORY_EMPTY = 'ERROR_NAVIGATION_LIST_EMPTY';

/**
 * Navigation entries cursor is invalid.
 */
export const ERROR_NAVIGATION_INDEX_INVALID = 'ERROR_NAVIGATION_CURSOR_INVALID';

/**
 * Navigation entries item is invalid.
 */
export const ERROR_NAVIGATION_ITEM_INVALID = 'ERROR_NAVIGATION_ITEM_INVALID';

/**
 * SSR component initialization failed.
 */
export const ERROR_SSR_INIT = 'ERROR_SSR_INIT';

/**
 * Server side called postEvent.
 */
export const ERROR_SSR_POST_EVENT = 'ERROR_SSR_POST_EVENT';

export type ErrorType =
  | typeof ERROR_METHOD_UNSUPPORTED
  | typeof ERROR_METHOD_PARAMETER_UNSUPPORTED
  | typeof ERROR_UNKNOWN_ENV
  | typeof ERROR_INVOKE_CUSTOM_METHOD_RESPONSE
  | typeof ERROR_TIMED_OUT
  | typeof ERROR_PARSE
  | typeof ERROR_UNEXPECTED_TYPE
  | typeof ERROR_NAVIGATION_HISTORY_EMPTY
  | typeof ERROR_NAVIGATION_INDEX_INVALID
  | typeof ERROR_NAVIGATION_ITEM_INVALID
  | typeof ERROR_SSR_INIT
  | typeof ERROR_SSR_POST_EVENT;
