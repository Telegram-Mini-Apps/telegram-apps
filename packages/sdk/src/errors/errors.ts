/**
 * Specified Mini Apps method is unsupported.
 */
export const ERR_METHOD_UNSUPPORTED = 'ERR_METHOD_UNSUPPORTED';

/**
 * Specified Mini Apps method parameter is unsupported.
 */
export const ERR_METHOD_PARAMETER_UNSUPPORTED = 'ERR_METHOD_PARAMETER_UNSUPPORTED';

/**
 * Current environment is not Telegram application.
 */
export const ERR_UNKNOWN_ENV = 'ERR_UNKNOWN_ENV';

/**
 * Telegram application returned and error while invoking custom method.
 */
export const ERR_INVOKE_CUSTOM_METHOD_RESPONSE = 'ERR_INVOKE_CUSTOM_METHOD_RESPONSE';

/**
 * Timeout reached.
 */
export const ERR_TIMED_OUT = 'ERR_TIMED_OUT';

/**
 * Value has unexpected type.
 */
export const ERR_UNEXPECTED_TYPE = 'ERR_UNEXPECTED_TYPE';

/**
 * Something went wrong during value parsing.
 */
export const ERR_PARSE = 'ERR_PARSE';

/**
 * Navigation entries list is empty.
 */
export const ERR_NAVIGATION_HISTORY_EMPTY = 'ERR_NAVIGATION_LIST_EMPTY';

/**
 * Navigation entries cursor is invalid.
 */
export const ERR_NAVIGATION_INDEX_INVALID = 'ERR_NAVIGATION_CURSOR_INVALID';

/**
 * Navigation entries item is invalid.
 */
export const ERR_NAVIGATION_ITEM_INVALID = 'ERR_NAVIGATION_ITEM_INVALID';

/**
 * SSR component initialization failed.
 */
export const ERR_SSR_INIT = 'ERR_SSR_INIT';

/**
 * Server side called postEvent.
 */
export const ERR_SSR_POST_EVENT = 'ERR_SSR_POST_EVENT';

/**
 * Path starts from the invalid base.
 */
export const ERR_INVALID_PATH_BASE = 'ERR_INVALID_PATH_BASE';

export type ErrorType =
  | typeof ERR_METHOD_UNSUPPORTED
  | typeof ERR_METHOD_PARAMETER_UNSUPPORTED
  | typeof ERR_UNKNOWN_ENV
  | typeof ERR_INVOKE_CUSTOM_METHOD_RESPONSE
  | typeof ERR_TIMED_OUT
  | typeof ERR_PARSE
  | typeof ERR_UNEXPECTED_TYPE
  | typeof ERR_NAVIGATION_HISTORY_EMPTY
  | typeof ERR_NAVIGATION_INDEX_INVALID
  | typeof ERR_NAVIGATION_ITEM_INVALID
  | typeof ERR_SSR_INIT
  | typeof ERR_SSR_POST_EVENT
  | typeof ERR_INVALID_PATH_BASE;
